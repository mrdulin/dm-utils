const { copyFileSync, mkdirSync } = require('node:fs');
const { dirname, resolve } = require('node:path');

const sourcePath = resolve(__dirname, '..', 'src', 'echarts', 'geo-json', 'china.json');
const destinationPath = resolve(__dirname, '..', 'dist', 'echarts', 'geo-json', 'china.json');

mkdirSync(dirname(destinationPath), { recursive: true });
copyFileSync(sourcePath, destinationPath);
