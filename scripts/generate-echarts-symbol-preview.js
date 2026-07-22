const { copyFileSync, mkdirSync, mkdtempSync, readdirSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { spawnSync } = require('node:child_process');
const { dirname, join, resolve } = require('node:path');

const rootPath = resolve(__dirname, '..');
const screenshotsPath = mkdtempSync(join(tmpdir(), 'dm-utils-symbols-preview-'));
const targetPath = resolve(rootPath, 'src', 'echarts', 'symbols', 'preview.png');
const cypressPath = resolve(rootPath, 'node_modules', 'cypress', 'bin', 'cypress');

function findPngFiles(directoryPath) {
  return readdirSync(directoryPath, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      return findPngFiles(entryPath);
    }
    return entry.name.endsWith('.png') ? [entryPath] : [];
  });
}

try {
  const result = spawnSync(
    process.execPath,
    [
      cypressPath,
      'run',
      '--component',
      '--browser',
      'electron',
      '--spec',
      'tests/echarts/symbols-preview.cy.tsx',
      '--config',
      `screenshotsFolder=${screenshotsPath}`,
      '--env',
      'generateSymbolsPreview=true',
    ],
    { cwd: rootPath, stdio: 'inherit' },
  );

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`Cypress 预览用例失败，退出码：${result.status}`);
  }

  const screenshots = findPngFiles(screenshotsPath);
  if (screenshots.length !== 1) {
    throw new Error(`预期生成 1 张预览图，实际生成 ${screenshots.length} 张`);
  }

  mkdirSync(dirname(targetPath), { recursive: true });
  copyFileSync(screenshots[0], targetPath);
} finally {
  rmSync(screenshotsPath, { force: true, recursive: true });
}
