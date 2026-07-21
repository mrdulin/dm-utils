# 中国地图 GeoJSON 文档设计

## 目标

在根目录 `README.md` 的 ECharts 章节中，说明如何使用 `src/echarts/geo-json/china.json` 注册并展示中国地图。

## 范围

- 在 `### echarts` 下新增 `#### 中国地图 GeoJSON` 小节。
- 链接到 `src/echarts/geo-json/china.json`。
- 提供包含 `registerMap('china', chinaJson)` 和 `geo.map: 'china'` 的最小 TypeScript 示例。
- 链接 ECharts `registerMap` 官方 API。

## 非目标

- 不修改 GeoJSON 数据。
- 不新增导出、依赖、测试或构建配置。
- 不调整其他 README 章节。

## 验证

- 检查 Markdown 标题层级与链接目标。
- 使用 Node.js 解析 `china.json`，确认数据保持有效 JSON。
