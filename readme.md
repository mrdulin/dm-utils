# @d-matrix/utils

![NPM Downloads](https://img.shields.io/npm/dw/%40d-matrix%2Futils)
![npm bundle size](https://img.shields.io/bundlephobia/min/%40d-matrix%2Futils)

A dozen of utils for Front-End Development

## API

- [clipboard](#clipboard)
- [react](#react)
- [dom](#dom)
- [date](#date)
- [types](#types)
- [algorithm](#algorithm)
- [file](#file)
- [support](#support)

### clipboard

- `clipboard.writeImage(element: HTMLImageElement | null | string): void`

复制图片到剪贴板。

### react

- `render<P>(element: ReactElement<P>): Promise<string>`

渲染`React`组件，返回HTML字符串。

- `cleanup(): void`

清理函数，需要在调用`render()`函数后调用。

- `useDisableContextMenu(target: ContextMenuTarget = defaultContextMenuTarget): void`

在`target`函数返回的元素上禁用右键菜单，默认的`target`是`() => document`

例1：在`id`是`test`的元素上禁用右键菜单

```tsx
import { react } from '@d-matrix/utils';

const TestComp = () => {
  react.useDisableContextMenu(() => document.getElementById('test'));

  return (
    <div>
      <div id='test'>此元素的右键菜单被禁用</div>
    </div>
  )
}
```

例2：在`document`上禁用右键菜单

```tsx
const TestComp = () => {
  react.useDisableContextMenu();

  return <div>内容</div>
}
```

- `useStateCallback<T>(initialState: T): [T, (state: T, cb?: (state: T) => void) => void]`

返回值`setState()`函数类似类组件中的`setState(updater[, callback])`,可以在`callback`中获取更新后的`state`

- `useIsMounted(): () => boolean`

获取当前组件是否已挂载的 Hook

```ts
const Test = () => {
  const isMounted = useIsMounted();

  useEffect(() => {
      if (isMounted()) {
       console.log('component mounted')
      }
  }, [isMounted]);

  return null
};
```

- `useCopyToClipboard(props?: UseCopyToClipboardProps)`

复制文本到剪切板, 用法见[测试](./tests/react.cy.tsx)

### dom

- `scrollToTop(element: Element | null | undefined): void`

元素滚动条滚动到顶部，对老旧浏览器做了兼容，见[浏览器兼容性](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTop#browser_compatibility)。

### date

- `rangeOfYears(start: number, end: number = new Date().getFullYear()): number[]`

创建`start`和`end`之间的年份数组。

### types

- `WithOptional<T, K extends keyof T>`

```ts
type A = { a: number; b: number; c: number; };
type T0 = WithOptional<A, 'b' | 'c'>;  // { a: number; b?: number; c?: number }
```

### algorithm

- `moveMulti<T extends unknown>(arr: T[], indexes: number[], start: number): T[]`

移动多个元素到数组中指定的位置,用法,见[测试用例](tests/algorithm.cy.ts)

### file

- `toImage(file: BlobPart | FileURL, options?: BlobPropertyBag): Promise<HTMLImageElement>`

转换BlobPart或者文件地址为图片对象

- `validateImageSize(file: BlobPart | FileURL, limitSize: { width: number; height: number }, options?: BlobPropertyBag): Promise<ImageSizeValidationResult>`

返回值:

```ts
interface ImageSizeValidationResult {
  isOk: boolean;
  width: number;
  height: number;
}
```

图片宽，高校验

- `isImageExists(src: string, img: HTMLImageElement = new Image()): Promise<boolean>`

检测图片地址是否可用

```ts
import { file } from '@d-matrix/utils';

const url = 'https://picsum.photos/200/300';
const res = await file.isImageExists(url);
```

传入HTML中已经存在的`img`元素

```js
import { file } from '@d-matrix/utils';

const $img = document.getElementById('img');
const res = await file.isImageExists(url, $img);
```

- `getFilenameFromContentDispositionHeader(header: { ['content-disposition']: string }): string`

从`Content-Disposition` response header中获取`filename`

```ts
import { file } from '@d-matrix/utils';

const header = {
  'content-disposition': 'attachment;filename=%E5%A4%A7%E8%A1%8C%E6%8C%87%E5%AF%BC2024-06-27-2024-06-28.xlsx'
};
const filename = file.getFilenameFromContentDispositionHeader(header);
// '大行指导2024-06-27-2024-06-28.xlsx'
```

## support

- `isBrowserEnv(): boolean`

是否是浏览器环境

- `isWebSocket(): boolean`

是否支持WebSocket

- `isSharedWorker(): boolean`

是否支持SharedWorker

## 测试

运行全部组件测试

```bash
npm run cy:run -- --component
```

运行单个组件测试

```bash
npm run cy:run -- --component --spec tests/date.cy.ts
```

## 发布

更新package version:

```bash
npm version <minor> or <major>...
```

构建:

```bash
npm build
```

发布：

```bash
npm publish --access public
```

镜像站查询版本与手动同步:

[npm镜像站](https://npmmirror.com/package/@d-matrix/utils)

通过`git log`命令获取changelogs，用于填写GitHub Release内容:

```bash
git log --oneline --decorate
```

## 注意事项

- [Before Publishing: Make Sure Your Package Installs and Works](https://docs.npmjs.com/cli/v10/using-npm/developers/#before-publishing-make-sure-your-package-installs-and-works)
- [npm-link](https://docs.npmjs.com/cli/v9/commands/npm-link)
- [Creating and publishing scoped public packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages)
