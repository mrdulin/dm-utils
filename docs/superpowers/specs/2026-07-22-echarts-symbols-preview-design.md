# ECharts Symbols Preview Design

## Goal

During `npm run build`, generate and track `src/echarts/symbols/preview.png`.
Embed the generated image in `readme.md` so repository visitors can inspect all
exported ECharts symbol paths.

## Design

- Add a dedicated Cypress preview spec that imports the symbol exports and
  renders each `path://` value as an SVG path in a fixed grid.
- Use a fixed viewport, white background, 2-column layout, consistent icon
  size, and visible export names to keep output deterministic.
- Add a Node script that invokes the Cypress spec and moves its screenshot to
  `src/echarts/symbols/preview.png`.
- Run the generator from `postbuild`, after TypeScript compilation and the
  existing China GeoJSON copy script complete.
- Add a relative Markdown image reference to `readme.md`.

## Failure Handling

- Fail generation when no symbols are exported.
- Fail the build when Cypress cannot render or the screenshot is not produced.
- Do not leave Cypress screenshot directories as tracked artifacts.

## Verification

- Run `npm run build`.
- Confirm `preview.png` has the PNG signature and is non-empty.
- Confirm `readme.md` references `./src/echarts/symbols/preview.png`.

