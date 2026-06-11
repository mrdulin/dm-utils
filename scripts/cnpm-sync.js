const { spawnSync } = require('node:child_process');

const packageName = process.env.npm_package_name;

if (!packageName) {
  console.error('npm_package_name is not set');
  process.exit(1);
}

const command = process.platform === 'win32' ? 'cnpm.cmd' : 'cnpm';
const result = spawnSync(command, ['sync', packageName], { stdio: 'inherit' });

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 0);
