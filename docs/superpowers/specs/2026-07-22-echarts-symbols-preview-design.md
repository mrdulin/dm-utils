# ECharts 图标预览图设计

## 目标

在执行 `npm run build` 时生成并纳入版本控制
`src/echarts/symbols/preview.png`。在 `readme.md` 中嵌入该图片，使仓库访问者能够
预览所有导出的 ECharts 图标路径。

## 设计

- 新增专用 Cypress 预览用例，导入 `symbols` 中的所有图标导出项，并渲染为固定网格。
- `path://` 图标以 SVG 路径渲染，并根据路径实际边界设置视图区域；
  `image://` 图标使用其原始 Data URL 渲染。
- 使用固定视口、白色背景、两列布局、一致的图标尺寸和可见的导出名称，确保生成结果稳定。
- 新增 Node 脚本，执行 Cypress 预览用例并将截图移动到
  `src/echarts/symbols/preview.png`。
- 在 TypeScript 编译和现有中国地图 GeoJSON 复制脚本完成后，从 `postbuild` 执行生成脚本。
- 在 `readme.md` 中添加相对路径的 Markdown 图片引用。

## 失败处理

- 没有可预览图标导出项时，生成失败。
- Cypress 无法渲染或未生成截图时，构建失败。
- 不将 Cypress 截图目录作为受版本控制的产物保留。

## 验证

- 执行 `npm run build`。
- 确认 `preview.png` 具有 PNG 文件签名且非空。
- 确认 `readme.md` 引用了 `./src/echarts/symbols/preview.png`。
