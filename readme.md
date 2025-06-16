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
- [timer](#timer)
- [operator](#operator)
- [decimal](#decimal)
- [object](#object)
- [array](#array)
- [number](#number)
- [echarts](#echarts)
- [color](#color)

### clipboard

- `writeImage(element: HTMLImageElement | null | string): Promise<void>`

复制图片到剪贴板

- `writeText(text: string): Promise<void>`

复制文本到剪切板

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

- `EnhancedComponent.prototype.setStateAsync(state)`

`setState()`方法的同步版本

```ts
import { react } from '@d-matrix/utils';

 class TestComponent extends EnhancedComponent<unknown, { pageIndex: number }> {
  state = {
    pageIndex: 1,
  };

  async onClick() {
    await this.setStateAsync({ pageIndex: 2 });
    console.log(this.state.pageIndex); // 2
  }

  render() {
    return (
      <button data-cy="test-button" onClick={() => this.onClick()}>
        click
      </button>
    );
  }
}
```

- `useDeepCompareRef(deps: DependencyList): React.MutableRefObject<number>`

深比较`deps`。返回`ref`，`ref.current`是一个自增数字，每次`deps`变化，`ref.current`加`1`。用法见[测试](./tests/react.cy.tsx)

- `InferRef<T>`

推导子组件的`ref`类型，适用于组件没有导出其`ref`类型的场景, 更多用法见[测试](./tests/react-types.tsx)

```tsx
interface ChildRefProps {
  prop1: () => void;
  prop2: () => void;
}

interface ChildProps {
  otherProp: string;
}

const Child = React.forwardRef<ChildRefProps, ChildProps>((props, ref) => {
  React.useImperativeHandle(
    ref,
    () => ({
      prop1() {},
      prop2() {},
    }),
    [],
  );

  return null;
});

type InferredChildRef = InferRef<typeof Child>;  // 等价于ChildRefProps

const Parent = () => {
  const childRef = React.useRef<InferredChildRef>(null);

  return <Child ref={childRef} otherProp="a" />;
};
```

- `useForwardRef = <T>(ref: ForwardedRef<T>, initialValue: any = null): React.MutableRefObject<T>`

解决使用`React.forwardRef`后，在调用`ref.current.someMethod()`时, 出现`Property 'current' does not exist on type '(instance: HTMLInputElement | null) => void'` TS类型错误，具体问题见[这里](https://stackoverflow.com/questions/66060217/i-cant-type-the-ref-correctly-using-useref-hook-in-typescript)

```ts
const Input = React.forwardRef<HTMLInputElement, React.ComponentPropsWithRef<'input'>>((props, ref) => {
  const forwardRef = useForwardRef<HTMLInputElement>(ref);
  useEffect(() => {
    forwardRef.current.focus();
  });
  return <input type="text" ref={forwardRef} value={props.value} />;
});
```

- `useMediaQuery(query, options?): boolean`

使用[Match Media API](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) 检测当前document是否匹配media query

```ts
import { useMediaQuery } from '@d-matrix/utils/react'

export default function Component() {
  const matches = useMediaQuery('(min-width: 768px)')

  return (
    <div>
      {`The view port is ${matches ? 'at least' : 'less than'} 768 pixels wide`}
    </div>
  )
}
```

- `useIsFirstRender(): boolean`

对于确定当前渲染是否是组件的第一个渲染很有用。当你想在初始渲染时有条件地执行某些逻辑或渲染特定组件时，这个 hook 特别有价值，提供了一种有效的方法来区分第一次和后续渲染。

### dom

- `scrollToTop(element: Element | null | undefined): void`

元素滚动条滚动到顶部，对老旧浏览器做了兼容，见[浏览器兼容性](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTop#browser_compatibility)。

- `strip(html: string): string`

从字符串中去除 HTML 标签并返回纯文本内容。

```ts
import { dom } from '@d-matrix/utils';

dom.strip('测试<em>高亮</em>测试'); // '测试高亮测试'
```

### date

- `rangeOfYears(start: number, end: number = new Date().getFullYear()): number[]`

创建`start`和`end`之间的年份数组。

- `getYears()`

```ts
export interface YearOption {
  label: string;
  value: number;
}

export enum YearOptionKind {
  Numbers,
  Objects,
}

export type GetYearsOptions = {
  // 开始年份
  startYear?: number;
  // 最近几年
  recentYears?: number;
  // 截止年份
  endYear?: number;
  // 后缀，默认为'年'
  suffix?: string;
};

export function getYears(options: GetYearsOptions & { type: YearOptionKind.Numbers }): number[];
export function getYears(options: GetYearsOptions & { type: YearOptionKind.Objects }): YearOption[];
export function getYears(options: GetYearsOptions & { type: YearOptionKind }): number[] | YearOption[]
```

获取n年，`type`传`YearOptionKind.Numbers`，返回`[2023, 2022, 2021]`数字数组；`type`传`YearOptionKind.Objects`，返回如下的对象数组

```sh
[
  { value: 2023, label: '2023年' },
  { value: 2022, label: '2022年' },
  { value: 2021, label: '2021年' },
]
```

更多用法，见[测试用例](./tests/date.cy.ts)

- `dayOfWeek(num: number, lang: keyof typeof i18n = 'zh'): string`

返回星期几, `lang`仅支持`zh`和`en`, `num`必须为正整数,否则报错

```js
dayOfWeek(0) // "日"
```

### types

- `WithOptional<T, K extends keyof T>`

```ts
type A = { a: number; b: number; c: number; };
type T0 = WithOptional<A, 'b' | 'c'>;  // { a: number; b?: number; c?: number }
```

- `FunctionPropertyNames<T>`

获取对象中的方法名称，返回union type

```ts
class A {
  add() {}
  minus() {}
  div() {}
  public result: number = 0;
}
type T0 = FunctionPropertyNames<A>; // 'add' | 'minus' | 'div'

const t1 = {
  add() {},
  minus() {},
  div() {},
  result: 0,
};
type T1 =  FunctionPropertyNames<typeof t1>; // 'add' | 'minus' | 'div'
```

- `NonFunctionPropertyNames<T>`

获取对象中非函数属性名称，返回union type

```ts
class A {
  add() {}
  minus() {}
  div() {}
  public result: number = 0;
}
type T0 = FunctionPropertyNames<A>; // 'result'

const t1 = {
  add() {},
  minus() {},
  div() {},
  result: 0,
};
type T1 =  FunctionPropertyNames<typeof t1>; // 'result'
```

- `ValueOf<T>`

获取对象中`key`的值，返回由这些值组成的union type

```ts
const map = {
  0: '0m',
  1: '1m',
  2: '2m',
  3: '3m',
  4: '4m',
  5: '5m',
  6: '6m',
} as const;

type T0 = ValueOf<typeof map>; // '0m' | '1m' | '2m' | '3m' | '4m' | '5m' | '6m'
```

- `WithRequired<T, K extends keyof T>`

指定属性变为必选

```ts
type Input = {
  a: number;
  b?: string;
};
type Output = WithRequired<Input, 'b'> // { a: number; b: string }
```

### algorithm

- `function nodeCountAtDepth(root: Record<string, any>, depth: number, childrenKey: string = 'children'): number;`

计算指定层级的节点数量

```ts
const root = {
  id: 1,
  children: [
    { id: 2, children: [{ id: 21 }, { id: 22 }, { id: 23 }] },
    { id: 3, children: [{ id: 31 }, { id: 32 }, { id: 33 }] },
  ],
};
expect(tree.nodeCountAtDepth(root, 0)).to.be.equal(1);
expect(tree.nodeCountAtDepth(root, 1)).to.be.equal(2);
expect(tree.nodeCountAtDepth(root, 2)).to.be.equal(6);
```

- `const findNode = <T extends Record<string, any>>(tree: T[], predicate: (node: T) => boolean, childrenKey = 'children'): T | null`

找到符合条件的节点

```ts
const root = {
  id: 1,
  children: [
    { id: 2, children: [{ id: 21 }, { id: 22 }, { id: 23 }] },
    { id: 3, children: [{ id: 31 }, { id: 32 }, { id: 33 }] },
  ],
};
const actual = tree.findNode([root], (node) => node.id === 3);
expect(actual).to.be.deep.equal(root.children[1]);

const actual2 = tree.findNode([root], (node) => node.id === 33);
expect(actual2).to.be.deep.equal(root.children[1].children[2]);
```

- `tree.findNode(tree, child, indentityKey, childrenKey)`

根据子节点查找父节点

```ts
const treeData = {
  code: 1,
  subs: [
    { code: 2, subs: [{ code: 21 }, { code: 22 }, { code: 23 }] },
    { code: 3, subs: [{ code: 31 }, { code: 32 }, { code: 33 }] },
  ],
};

const actual = tree.findParent(treeData, treeData.subs[1].subs[2], 'code', 'subs');
expect(actual).to.be.deep.equal(treeData.subs[1]);
```

- `function findPath<T extends Record<string, any>>(tree: T[], func: (node: T) => boolean, childrenKey = 'children'): T[] | null`

查找节点路径, 返回节点数组或`null`

```ts
const treeData = {
  code: 1,
  subs: [
    { code: 2, subs: [{ code: 21 }, { code: 22 }, { code: 23 }] },
    { code: 3, subs: [{ code: 31 }, { code: 32 }, { code: 33 }] },
  ],
};

const actual = tree.findPath([root], (node) => node.id === 33);
expect(actual).to.be.deep.equal([root, root.children[1], root.children[1].children[2]]);
```

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

- `download(source: string | Blob, fileName = '', target?: HyperLinkTarget): void`

文件下载，`source`是文件地址或`blob`对象。

```ts
type HyperLinkTarget = "_self" | "_blank" | "_parent" | "_top"
```

- `downloadFileByIframe(source: string): boolean`

通过创建`iframe`进行文件下载

## support

- `isBrowserEnv(): boolean`

是否是浏览器环境

- `isWebSocket(): boolean`

是否支持WebSocket

- `isSharedWorker(): boolean`

是否支持SharedWorker

## timer

- `sleep(ms?: number): Promise<unknown>`

使用`setTimeout`与`Promise`实现，暂停执行`ms`毫秒

```ts
await sleep(3000); // 暂停3秒
console.log('continue'); // 继续执行
```

## operator

- `trueTypeOf = (obj: unknown): string`

检查数据类型

```ts
trueTypeOf([]); // array
trueTypeOf({}); // object
trueTypeOf(''); // string
trueTypeOf(new Date()); // date
trueTypeOf(1); // number
trueTypeOf(function () {}); // function
trueTypeOf(/test/i); // regexp
trueTypeOf(true); // boolean
trueTypeOf(null); // null
trueTypeOf(undefined); // undefined
```

## decimal

- `format(value: number | string | undefined | null, options?: FormatOptions): string`

格式化数字，默认保留3位小数，可添加前缀，后缀，默认值为'--'，用法见[测试](./tests//decimal.cy.ts)

```ts
type FormatOptions = {
  decimalPlaces?: number | false;
  suffix?: string;
  prefix?: string;
  defaultValue?: string;
  operation?: {
    operator: 'add' | 'sub' | 'mul' | 'div' | 'toDecimalPlaces';
    value: number;
  }[];
};
```

## object

- `removeZeroValueKeys = <T extends Record<string, any>>(obj: T, zeroValues = ZeroValues): T`

移除零值的键, 默认的零值是：`undefined`、`null`, `''`, `NaN`, `[]`, `{}`

```ts
removeZeroValueKeys({ a: '', b: 'abc', c: undefined, d: null, e: NaN, f: -1, g: [], h: {} })
// { b: 'abc', f: -1 }
```

- `typedKeys(obj: T): Array<keyof T>`

返回`tuple`，而不是`string[]`

```ts
const obj = { a: 1, b: '2' };
Object.keys(obj) //  string[]
object.typedKeys({ a: 1, b: '2' }) // ('a' | 'b')[]
```

## array

- `moveImmutable<T>(array: T[], fromIndex: number, toIndex: number): T[]`

```js
import { array } from '@d-matrix/utils';

const input = ['a', 'b', 'c'];

const array1 = array.moveImmutable(input, 1, 2);
console.log(array1);
//=> ['a', 'c', 'b']

const array2 = array.moveImmutable(input, -1, 0);
console.log(array2);
//=> ['c', 'a', 'b']

const array3 = array.moveImmutable(input, -2, -3);
console.log(array3);
//=> ['b', 'a', 'c']
```

- `moveMutable<T>(array: T[], fromIndex: number, toIndex: number): void`

- `moveToStart<T>(array: T[], predicate: (item: T) => boolean): T[]`

移动元素到数组首位，不会修改原数组

```js
import { array } from '@d-matrix/utils';

const list = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
const newList = array.moveToStart(list, (item) => item.id === 4);

// [{ id: 4 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 5 }]
```

- `moveMulti<T extends unknown>(arr: T[], indexes: number[], start: number): T[]`

移动多个元素到数组中指定的位置,用法,见[测试用例](tests/algorithm.cy.ts)

- `getArrayOrUndefined<T>(array?: T[] | undefined | null): T[] | undefined`

如果`array`是数组且不为空,返回该数组，否则返回`undefined`,见[测试用例](tests/array.cy.ts)

## number

- `randomInt(min: number, max: number): number`

返回`min`, `max`之间的随机整数

## echarts

- `mergeOption(defaults: EChartsOption, overrides: EChartsOption, option?: deepmerge.Options): EChartsOption`

deep merge Echarts配置，用法见[测试用例](./tests//echarts/echarts.cy.ts)

- `fill<T extends Record<string, any>, XAxisField extends keyof T, YAxisField extends keyof T>(dataSource: T[], xAxisField:XAxisField, yAxisField: YAxisField): T[]`

场景：后端接口返回某几个时间点的数据，需求是在接口数据的基础上每隔5分钟补一个点，以达到图中的效果: [折线图](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/Dingtalk_20240724140535.jpg)。

填充的点的Y轴值为前一个点的值, 时间示例: [9:23, 9:27] => [9:23, 9:25, 9:27, 9:30]，更多，见[测试用例](./tests/echarts/fill.cy.ts)

- `calcYAxisRange<T extends Record<string, any>, Key extends keyof T>(data: T[], key: Key, decimalPlaces = 2, splitNumber = 5): { max:number; min:number }`

计算echarts YAxis的max和min属性，以达到根据实际数据动态调整，使折线图的波动明显。且第一个点始终在Y轴中间位置，[效果图](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/Dingtalk_20240724140535.jpg)

## color

- `hexToRGBA(hex: string, alpha: number | string = 1): string`

将十六进制颜色转换为 RGBA 颜色, 见[测试用例](./tests/color.cy.ts)

## 测试

运行全部组件测试

```bash
npm run cy:component:all
```

运行单个组件测试

```bash
npm run cy:component -- tests/date.cy.ts
```

运行E2E测试

将`src`通过`tsc` build到`public/dist`目录

```bash
npm run build:public
```

启动一个Web服务器来访问`public/index.html`文件，`dist`目录的脚本可以通过`<script type="module"/>`引入

```bash
npm run serve
```

最后启动cypress GUI客户端，选择E2E测试

```bash
npm run cy:open
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

网络原因导致连接registry服务器超时,可指定proxy

```bash
npm --proxy http://127.0.0.1:7890 publish
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
