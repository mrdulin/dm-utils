# @d-matrix/utils

![NPM Downloads](https://img.shields.io/npm/dw/%40d-matrix%2Futils)
![npm bundle size](https://img.shields.io/bundlephobia/min/%40d-matrix%2Futils)

A dozen of utils for Front-End Development

## API

- [clipboard](#clipboard)
- [react](#react)
- [dom](#dom)

### clipboard

- `clipboard.writeImage(element: HTMLImageElement): void`

复制图片到剪贴板。

### react

- `render<P>(element: ReactElement<P>): Promise<string>`

渲染`React`组件，返回HTML字符串。

- `cleanup(): void`

清理函数，需要在调用`render()`函数后调用。

### dom

- `scrollToTop(element: Element | null | undefined): void`

元素滚动条滚动到顶部，对老旧浏览器做了兼容，见[浏览器兼容性](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTop#browser_compatibility)。

## 注意事项

- [Before Publishing: Make Sure Your Package Installs and Works](https://docs.npmjs.com/cli/v10/using-npm/developers/#before-publishing-make-sure-your-package-installs-and-works)
- [npm-link](https://docs.npmjs.com/cli/v9/commands/npm-link)
- [Creating and publishing scoped public packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages)
