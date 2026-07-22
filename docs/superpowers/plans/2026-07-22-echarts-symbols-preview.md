# ECharts 图标预览图实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 在构建时生成 `src/echarts/symbols/preview.png`，并在 `readme.md` 中展示 `symbols` 导出的全部 ECharts 图标。

**架构：** Cypress 组件用例导入 `symbols`，将 `path://` 图标渲染为 SVG 路径、将 `image://` 图标渲染为 Data URL 图片。所有图标固定在 `72px × 72px` 画布内，路径按自身边界等比填充，图片使用 `object-fit: contain`。Node 脚本临时指定 Cypress 截图目录，执行该用例、验证只得到一张截图并复制到受版本控制的目标路径。`postbuild` 在复制中国地图 GeoJSON 后调用该脚本。

**技术栈：** Node.js 16 内置模块、Cypress 13、React、Vite、TypeScript。

---

## 文件结构

- 创建：`tests/echarts/symbols-preview.cy.tsx`，渲染预览网格、验证图标可显示，并在构建模式写入截图。
- 创建：`scripts/generate-echarts-symbol-preview.js`，执行专用 Cypress 用例并将唯一截图复制到目标路径。
- 修改：`package.json`，在现有 `postbuild` 中调用预览生成脚本。
- 修改：`readme.md`，在 ECharts 文档章节嵌入生成的 PNG。
- 创建：`src/echarts/symbols/preview.png`，构建生成且纳入版本控制的预览图片。

### 任务 1：创建图标预览组件用例

**文件：**
- 创建：`tests/echarts/symbols-preview.cy.tsx`

- [ ] **步骤 1：编写渲染与分类测试**

```tsx
import React, { useLayoutEffect, useRef, useState } from 'react';
import symbols from '../../src/echarts/symbols';

const pathPrefix = 'path://';
const imagePrefix = 'image://';

function PathIcon({ value }: { value: string }) {
  const pathRef = useRef<SVGPathElement>(null);
  const [viewBox, setViewBox] = useState('0 0 1 1');

  useLayoutEffect(() => {
    const box = pathRef.current?.getBBox();
    if (box && box.width > 0 && box.height > 0) {
      const padding = Math.max(box.width, box.height) * 0.1;
      setViewBox(`${box.x - padding} ${box.y - padding} ${box.width + padding * 2} ${box.height + padding * 2}`);
    }
  }, [value]);

  return (
    <svg aria-hidden="true" viewBox={viewBox} width="72" height="72">
      <path ref={pathRef} d={value.slice(pathPrefix.length)} fill="#1677ff" />
    </svg>
  );
}

function SymbolPreview() {
  const entries = Object.entries(symbols);

  if (entries.length === 0) {
    throw new Error('symbols 中没有可生成预览的图标');
  }

  return (
    <main data-cy="echarts-symbols-preview">
      <h1>ECharts Symbols</h1>
      <div data-cy="symbol-grid">
        {entries.map(([name, value]) => (
          <section data-cy="symbol-card" key={name}>
            <div data-cy="symbol-icon">
              {value.startsWith(pathPrefix) ? (
                <PathIcon value={value} />
              ) : value.startsWith(imagePrefix) ? (
                <img
                  src={value.slice(imagePrefix.length)}
                  alt=""
                  width="72"
                  height="72"
                  style={{ objectFit: 'contain' }}
                />
              ) : (
                (() => {
                  throw new Error(`${name} 的图标格式不受支持`);
                })()
              )}
            </div>
            <code>{name}</code>
          </section>
        ))}
      </div>
    </main>
  );
}

describe('ECharts 图标预览', () => {
  it('渲染 symbols 中的全部图标', () => {
    const values = Object.values(symbols);
    const pathCount = values.filter((value) => value.startsWith(pathPrefix)).length;
    const imageCount = values.filter((value) => value.startsWith(imagePrefix)).length;

    cy.mount(<SymbolPreview />);

    cy.get('[data-cy=symbol-card]').should('have.length', Object.keys(symbols).length);
    if (pathCount > 0) {
      cy.get('[data-cy=symbol-card] svg path').should(($paths) => {
        expect($paths).to.have.length(pathCount);
        $paths.each((_, path) => {
          const box = path.getBBox();
          expect(box.width).to.be.greaterThan(0);
          expect(box.height).to.be.greaterThan(0);
        });
      });
    }
    if (imageCount > 0) {
      cy.get('[data-cy=symbol-card] img').should(($images) => {
        expect($images).to.have.length(imageCount);
        $images.each((_, image) => {
          expect(image.complete).to.equal(true);
          expect(image.naturalWidth).to.be.greaterThan(0);
        });
      });
    }
  });
});
```

- [ ] **步骤 2：运行用例并确认失败**

运行：

```powershell
npx cypress run --component --browser electron --spec tests/echarts/symbols-preview.cy.tsx
```

预期：FAIL，提示找不到 `tests/echarts/symbols-preview.cy.tsx`。

- [ ] **步骤 3：完成固定布局与构建截图分支**

在 `SymbolPreview` 中为 `main`、网格、卡片和图标容器设置以下固定样式。`PathIcon` 保持 `width="72"`、`height="72"`，以路径边界的 `10%` 作为统一留白；图片使用 `objectFit: 'contain'`，使两种图标都落在相同画布内。

```tsx
const previewStyle = { width: '960px', minHeight: '100vh', padding: '32px', background: '#ffffff' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' };
const cardStyle = {
  display: 'grid',
  gridTemplateColumns: '96px minmax(0, 1fr)',
  alignItems: 'center',
  height: '132px',
  padding: '16px',
  border: '1px solid #d9d9d9',
};
const iconStyle = { width: '72px', height: '72px', display: 'grid', placeItems: 'center' };
```

随后在用例末尾添加：

```tsx
    if (Cypress.env('generateSymbolsPreview')) {
      cy.screenshot('echarts-symbols-preview', {
        capture: 'fullPage',
      });
    }
```

- [ ] **步骤 4：运行普通组件用例**

运行：

```powershell
npx cypress run --component --browser electron --spec tests/echarts/symbols-preview.cy.tsx
```

预期：PASS，且不在仓库内产生截图。

- [ ] **步骤 5：Commit**

```powershell
git add tests/echarts/symbols-preview.cy.tsx
git commit -m "test: render echarts symbols preview"
```

### 任务 2：实现构建期截图生成脚本

**文件：**
- 创建：`scripts/generate-echarts-symbol-preview.js`
- 测试：`tests/echarts/symbols-preview.cy.tsx`

- [ ] **步骤 1：编写生成脚本**

```js
const { copyFileSync, mkdirSync, mkdtempSync, readdirSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { dirname, join, resolve } = require('node:path');
const { spawnSync } = require('node:child_process');

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
```

- [ ] **步骤 2：运行脚本并确认生成结果**

运行：

```powershell
node scripts/generate-echarts-symbol-preview.js
```

预期：命令退出码为 `0`，生成 `src/echarts/symbols/preview.png`，且临时截图目录被删除。

- [ ] **步骤 3：验证 PNG 文件签名**

运行：

```powershell
Get-Content -Encoding Byte -TotalCount 8 src/echarts/symbols/preview.png | ForEach-Object { '{0:X2}' -f $_ }
```

预期：输出以 `89 50 4E 47 0D 0A 1A 0A` 开头。

- [ ] **步骤 4：Commit**

```powershell
git add scripts/generate-echarts-symbol-preview.js src/echarts/symbols/preview.png
git commit -m "build: generate echarts symbols preview"
```

### 任务 3：接入构建和 README

**文件：**
- 修改：`package.json`
- 修改：`readme.md`
- 测试：`tests/echarts/symbols-preview.cy.tsx`

- [ ] **步骤 1：更新构建脚本**

将 `package.json` 中的 `postbuild` 改为：

```json
"postbuild": "node scripts/copy-china-geo-json.js && node scripts/generate-echarts-symbol-preview.js"
```

- [ ] **步骤 2：嵌入 README 图片**

在 `readme.md` 的 `### echarts` 标题和功能说明之间添加：

```md
![ECharts 图标预览](./src/echarts/symbols/preview.png)
```

- [ ] **步骤 3：运行完整构建**

运行：

```powershell
npm run build
```

预期：TypeScript 编译、GeoJSON 复制和 Cypress 预览生成均成功，`preview.png` 被刷新。

- [ ] **步骤 4：验证 README 引用和工作区改动**

运行：

```powershell
Select-String -Path readme.md -Pattern '\./src/echarts/symbols/preview\.png'
git status --short
```

预期：README 图片引用存在；本任务只包含 `package.json`、`readme.md`、预览脚本、预览用例和 `preview.png` 的相关改动。

- [ ] **步骤 5：Commit**

```powershell
git add package.json readme.md
git commit -m "docs: preview echarts symbols"
```
