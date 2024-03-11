# dm-utils

A dozen of utils for Front-End Development

## API

- [clipboard](#clipboard)
- [react](#react)

### clipboard

`clipboard.writeImage(element: HTMLImageElement): void`

复制图片到剪贴板。

### react

`render<P>(element: ReactElement<P>): Promise<string>`

渲染`React`组件，返回HTML字符串。

`cleanup(): void`

清理函数，需要在调用`render()`函数后调用。

## 注意事项

- [Before Publishing: Make Sure Your Package Installs and Works](https://docs.npmjs.com/cli/v10/using-npm/developers/#before-publishing-make-sure-your-package-installs-and-works)
- [npm-link](https://docs.npmjs.com/cli/v9/commands/npm-link)
- [Creating and publishing scoped public packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages)
