# @d-matrix/utils

![NPM Downloads](https://img.shields.io/npm/dw/%40d-matrix%2Futils)
![npm bundle size](https://img.shields.io/bundlephobia/min/%40d-matrix%2Futils)
[![NPM version](https://img.shields.io/npm/v/@d-matrix/utils.svg?style=flat)](https://www.npmjs.com/package/@d-matrix/utils)

`@d-matrix/utils` 是一个面向前端开发的 TypeScript 工具函数集合，按命名空间导出浏览器、React、日期、数组、数值、文件与图表等常用能力。

文档同时保留了详细 API 说明、测试入口和发布命令，既适合作为包使用说明，也适合作为仓库维护入口。

## 特性

- 按命名空间导出，导入路径稳定，适合在业务项目中按模块组织调用。
- 覆盖前端常见场景，包括剪贴板、DOM、React Hook、文件处理、ECharts、数组与数值计算。
- 提供 Cypress 组件测试、类型测试和示例页面，便于验证行为与查看用法。

## 快速开始

### 安装

```bash
npm install @d-matrix/utils
```

如果你会使用 `react` 或 `echarts` 相关能力，请根据项目实际情况安装对应的 peer dependencies。

### 导入方式

包的公开入口与 [src/index.ts](./src/index.ts) 保持一致，推荐按命名空间导入：

```ts
import { array, date, number, react } from '@d-matrix/utils';
```

### 基本示例

```ts
import { date, number } from '@d-matrix/utils';

const years = date.getYears({ type: date.YearOptionKind.Numbers, recentYears: 3 });
const ratio = number.safeDivide('12', '4');

console.log(years); // [2026, 2025, 2024]
console.log(ratio); // 3
```

```tsx
import React from 'react';
import { react } from '@d-matrix/utils';

export function ResponsivePanel() {
  const isDesktop = react.useMediaQuery('(min-width: 1024px)');

  return <div>{isDesktop ? 'desktop' : 'mobile'}</div>;
}
```

## API 导航

每个 API 默认收起，点击展开可查看说明、示例和测试入口。

- [clipboard](#clipboard)：剪贴板读写。
- [react](#react)：React 渲染、Hook 与类型辅助。
- [dom](#dom)：DOM 操作与 HTML 字符串处理。
- [date](#date)：年份与星期相关工具。
- [types](#types)：TypeScript 类型工具。
- [algorithm](#algorithm)：树结构与二分相关算法。
- [file](#file)：图片、下载与文件辅助。
- [support](#support)：运行环境能力检测。
- [timer](#timer)：异步等待工具。
- [operator](#operator)：运行时类型判断。
- [decimal](#decimal)：十进制格式化。
- [object](#object)：对象清理与键名辅助。
- [array](#array)：数组移动、统计与排名。
- [number](#number)：安全数值运算。
- [echarts](#echarts)：ECharts 配置与数据处理。
- [color](#color)：颜色转换。
- [scene](#scene)：业务场景选择态与排序工具。

## API 详情

### clipboard

提供剪贴板写入能力，支持文本和图片两类常见前端交互场景。

相关测试：[clipboard.cy.tsx](./tests/clipboard.cy.tsx)

<details>
<summary><code>writeImage(element: HTMLImageElement | null | string): Promise&lt;void&gt;</code></summary>

复制图片到剪贴板。

</details>

<details>
<summary><code>writeText(text: string): Promise&lt;void&gt;</code></summary>

复制文本到剪贴板。

</details>

### react

提供 React 渲染、常用 Hook、类组件增强能力与类型辅助工具。

相关测试：[react.cy.tsx](./tests/react.cy.tsx)、[react-types.tsx](./tests/react-types.tsx)

<details>
<summary><code>render&lt;P&gt;(element: ReactElement&lt;P&gt;): Promise&lt;string&gt;</code></summary>

渲染 `React` 组件并返回 HTML 字符串。

</details>

<details>
<summary><code>cleanup(): void</code></summary>

清理函数，需要在调用 `render()` 后执行。

</details>

<details>
<summary><code>useDisableContextMenu(target: ContextMenuTarget = defaultContextMenuTarget): void</code></summary>

在 `target` 函数返回的元素上禁用右键菜单，默认 `target` 为 `() => document`。

例 1：在 `id` 是 `test` 的元素上禁用右键菜单。

```tsx
import { react } from '@d-matrix/utils';

const TestComp = () => {
  react.useDisableContextMenu(() => document.getElementById('test'));

  return (
    <div>
      <div id="test">此元素的右键菜单被禁用</div>
    </div>
  );
};
```

例 2：在 `document` 上禁用右键菜单。

```tsx
const TestComp = () => {
  react.useDisableContextMenu();

  return <div>内容</div>;
};
```

</details>

<details>
<summary><code>useStateCallback&lt;T&gt;(initialState: T): [T, (state: T, cb?: (state: T) =&gt; void) =&gt; void]</code></summary>

返回值中的 `setState()` 类似类组件里的 `setState(updater[, callback])`，可在 `callback` 中获取更新后的 `state`。

</details>

<details>
<summary><code>useIsMounted(): () =&gt; boolean</code></summary>

获取当前组件是否已挂载的 Hook。

```ts
const Test = () => {
  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted()) {
      console.log('component mounted');
    }
  }, [isMounted]);

  return null;
};
```

</details>

<details>
<summary><code>useCopyToClipboard(props?: UseCopyToClipboardProps)</code></summary>

复制文本到剪贴板。更多用法见[测试](./tests/react.cy.tsx)。

</details>

<details>
<summary><code>EnhancedComponent.prototype.setStateAsync(state)</code></summary>

`setState()` 方法的同步版本。

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

</details>

<details>
<summary><code>useDeepCompareRef(deps: DependencyList): React.MutableRefObject&lt;number&gt;</code></summary>

深比较 `deps`。返回的 `ref.current` 是自增数字，每次 `deps` 变化时加 `1`。更多用法见[测试](./tests/react.cy.tsx)。

</details>

<details>
<summary><code>InferRef&lt;T&gt;</code></summary>

推导子组件的 `ref` 类型，适用于组件没有导出 `ref` 类型的场景。更多用法见[测试](./tests/react-types.tsx)。

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

type InferredChildRef = InferRef<typeof Child>; // 等价于 ChildRefProps

const Parent = () => {
  const childRef = React.useRef<InferredChildRef>(null);

  return <Child ref={childRef} otherProp="a" />;
};
```

</details>

<details>
<summary><code>useForwardRef = &lt;T&gt;(ref: ForwardedRef&lt;T&gt;, initialValue: any = null): React.MutableRefObject&lt;T&gt;</code></summary>

解决 `React.forwardRef` 场景下调用 `ref.current.someMethod()` 时出现 `Property 'current' does not exist on type '(instance: HTMLInputElement | null) => void'` 的 TypeScript 类型错误。问题背景见[这里](https://stackoverflow.com/questions/66060217/i-cant-type-the-ref-correctly-using-useref-hook-in-typescript)。

```ts
const Input = React.forwardRef<HTMLInputElement, React.ComponentPropsWithRef<'input'>>((props, ref) => {
  const forwardRef = useForwardRef<HTMLInputElement>(ref);
  useEffect(() => {
    forwardRef.current.focus();
  });
  return <input type="text" ref={forwardRef} value={props.value} />;
});
```

</details>

<details>
<summary><code>useMediaQuery(query, options?): boolean</code></summary>

使用 [Match Media API](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) 检测当前 `document` 是否匹配 media query。

```ts
import { useMediaQuery } from '@d-matrix/utils/react';

export default function Component() {
  const matches = useMediaQuery('(min-width: 768px)');

  return <div>{`The viewport is ${matches ? 'at least' : 'less than'} 768 pixels wide`}</div>;
}
```

</details>

<details>
<summary><code>useIsFirstRender(): boolean</code></summary>

用于判断当前渲染是否为组件的第一次渲染，适合在初始渲染与后续渲染之间做逻辑区分。

</details>

### dom

提供 DOM 滚动、纯文本提取和 HTML 颜色值转换等浏览器侧工具。

相关测试：[dom.cy.tsx](./tests/dom.cy.tsx)

<details>
<summary><code>scrollToTop(element: Element | null | undefined): void</code></summary>

将元素滚动条滚动到顶部，并兼容老旧浏览器。浏览器兼容性见[MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTop#browser_compatibility)。

</details>

<details>
<summary><code>strip(html: string): string</code></summary>

从字符串中去除 HTML 标签并返回纯文本内容。

```ts
import { dom } from '@d-matrix/utils';

dom.strip('测试<em>高亮</em>测试'); // '测试高亮测试'
```

</details>

<details>
<summary><code>convertRgbToHexInHtml(htmlStr: string): string</code></summary>

将 HTML 字符串中的 RGB / RGBA 颜色值转换为十六进制颜色值。

```ts
const html = '<div style="color: rgb(255, 0, 0)">Red text</div>';
dom.convertRgbToHexInHtml(html); // <div style="color: #ff0000">Red text</div>
```

</details>

### date

提供年份选项构造和星期展示等日期辅助能力。

相关测试：[date.cy.ts](./tests/date.cy.ts)

<details>
<summary><code>rangeOfYears(start: number, end: number = new Date().getFullYear()): number[]</code></summary>

创建 `start` 到 `end` 之间的年份数组。

</details>

<details>
<summary><code>getYears()</code></summary>

获取最近若干年。`type` 传 `YearOptionKind.Numbers` 时返回数字数组；传 `YearOptionKind.Objects` 时返回对象数组。

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
  startYear?: number;
  recentYears?: number;
  endYear?: number;
  suffix?: string;
};

export function getYears(options: GetYearsOptions & { type: YearOptionKind.Numbers }): number[];
export function getYears(options: GetYearsOptions & { type: YearOptionKind.Objects }): YearOption[];
export function getYears(options: GetYearsOptions & { type: YearOptionKind }): number[] | YearOption[];
```

```ts
[
  { value: 2023, label: '2023年' },
  { value: 2022, label: '2022年' },
  { value: 2021, label: '2021年' },
]
```

更多用法见[测试用例](./tests/date.cy.ts)。

</details>

<details>
<summary><code>dayOfWeek(num: number, lang: keyof typeof i18n = 'zh'): string</code></summary>

返回星期几。`lang` 仅支持 `zh` 和 `en`，`num` 需要是整数，内部按 `7` 取模。

```ts
dayOfWeek(0); // '日'
```

</details>

### types

提供常用的 TypeScript 类型变换工具，适合在业务类型声明中复用。

相关测试：[types.ts](./tests/types.ts)

<details>
<summary><code>WithOptional&lt;T, K extends keyof T&gt;</code></summary>

将指定属性设为可选。

```ts
type A = { a: number; b: number; c: number };
type T0 = WithOptional<A, 'b' | 'c'>; // { a: number; b?: number; c?: number }
```

</details>

<details>
<summary><code>Nullishable&lt;T&gt;</code></summary>

为任意类型 `T` 扩展 `undefined | null`。

```ts
type T0 = Nullishable<string>; // string | undefined | null
```

</details>

<details>
<summary><code>Optional&lt;T&gt;</code></summary>

为任意类型 `T` 扩展 `undefined`。

```ts
type T0 = Optional<number>; // number | undefined
```

</details>

<details>
<summary><code>NullableValue&lt;T&gt;</code></summary>

为任意类型 `T` 扩展 `null`。

```ts
type T0 = NullableValue<boolean>; // boolean | null
```

</details>

<details>
<summary><code>FunctionPropertyNames&lt;T&gt;</code></summary>

获取对象中的方法名称，返回 union type。

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
type T1 = FunctionPropertyNames<typeof t1>; // 'add' | 'minus' | 'div'
```

</details>

<details>
<summary><code>NonFunctionPropertyNames&lt;T&gt;</code></summary>

获取对象中的非函数属性名称，返回 union type。

```ts
class A {
  add() {}
  minus() {}
  div() {}
  public result: number = 0;
}
type T0 = NonFunctionPropertyNames<A>; // 'result'

const t1 = {
  add() {},
  minus() {},
  div() {},
  result: 0,
};
type T1 = NonFunctionPropertyNames<typeof t1>; // 'result'
```

</details>

<details>
<summary><code>ValueOf&lt;T&gt;</code></summary>

获取对象中所有值组成的 union type。

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

</details>

<details>
<summary><code>WithRequired&lt;T, K extends keyof T&gt;</code></summary>

将指定属性变为必选。

```ts
type Input = {
  a: number;
  b?: string;
};
type Output = WithRequired<Input, 'b'>; // { a: number; b: string }
```

</details>

### algorithm

收录树结构与二分相关的算法辅助能力。

相关测试：[tree.cy.ts](./tests/algorithm/tree.cy.ts)、[binary.cy.ts](./tests/algorithm/binary.cy.ts)

<details>
<summary><code>nodeCountAtDepth(root: Record&lt;string, any&gt;, depth: number, childrenKey: string = 'children'): number</code></summary>

计算指定层级的节点数量。

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

</details>

<details>
<summary><code>findNode&lt;T extends Record&lt;string, any&gt;&gt;(tree: T[], predicate: (node: T) =&gt; boolean, childrenKey = 'children'): T | null</code></summary>

找到符合条件的节点。

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

</details>

<details>
<summary><code>findParent(tree, child, indentityKey, childrenKey)</code></summary>

根据子节点查找父节点。

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

</details>

<details>
<summary><code>findPath&lt;T extends Record&lt;string, any&gt;&gt;(tree: T[], func: (node: T) =&gt; boolean, childrenKey = 'children'): T[] | null</code></summary>

查找节点路径，返回节点数组或 `null`。

```ts
const root = {
  id: 1,
  children: [
    { id: 2, children: [{ id: 21 }, { id: 22 }, { id: 23 }] },
    { id: 3, children: [{ id: 31 }, { id: 32 }, { id: 33 }] },
  ],
};

const actual = tree.findPath([root], (node) => node.id === 33);
expect(actual).to.be.deep.equal([root, root.children[1], root.children[1].children[2]]);
```

</details>

<details>
<summary><code>flatten(tree, childrenKey = 'children')</code></summary>

扁平化树结构，返回的每个节点都不包含 `children` 属性。

</details>

### file

提供图片加载、尺寸校验、文件下载和响应头文件名解析等工具。

相关测试：[file.cy.ts](./tests/file.cy.ts)

<details>
<summary><code>toImage(file: BlobPart | FileURL, options?: BlobPropertyBag): Promise&lt;HTMLImageElement&gt;</code></summary>

将 `BlobPart` 或文件地址转换为图片对象。

</details>

<details>
<summary><code>validateImageSize(file: BlobPart | FileURL, limitSize: { width: number; height: number }, options?: BlobPropertyBag): Promise&lt;ImageSizeValidationResult&gt;</code></summary>

图片宽高校验。

返回值：

```ts
interface ImageSizeValidationResult {
  isOk: boolean;
  width: number;
  height: number;
}
```

</details>

<details>
<summary><code>isImageExists(src: string, img: HTMLImageElement = new Image()): Promise&lt;boolean&gt;</code></summary>

检测图片地址是否可用。

```ts
import { file } from '@d-matrix/utils';

const url = 'https://picsum.photos/200/300';
const res = await file.isImageExists(url);
```

传入 HTML 中已存在的 `img` 元素：

```ts
import { file } from '@d-matrix/utils';

const $img = document.getElementById('img');
const res = await file.isImageExists(url, $img as HTMLImageElement);
```

</details>

<details>
<summary><code>getFilenameFromContentDispositionHeader(header: { ['content-disposition']: string }): string</code></summary>

从 `Content-Disposition` response header 中获取 `filename`。

```ts
import { file } from '@d-matrix/utils';

const header = {
  'content-disposition': 'attachment;filename=%E5%A4%A7%E8%A1%8C%E6%8C%87%E5%AF%BC2024-06-27-2024-06-28.xlsx',
};
const filename = file.getFilenameFromContentDispositionHeader(header);
// '大行指导2024-06-27-2024-06-28.xlsx'
```

</details>

<details>
<summary><code>download(source: string | Blob, fileName = '', target?: HyperLinkTarget): void</code></summary>

文件下载，`source` 可以是文件地址或 `blob` 对象。

```ts
type HyperLinkTarget = '_self' | '_blank' | '_parent' | '_top';
```

</details>

<details>
<summary><code>downloadByIframe(source: string): boolean</code></summary>

通过创建 `iframe` 进行文件下载。

</details>

### support

提供浏览器、WebSocket、SharedWorker 等运行环境能力检测函数。

相关测试：暂无专用测试

<details>
<summary><code>isBrowserEnv(): boolean</code></summary>

判断当前是否为浏览器环境。

</details>

<details>
<summary><code>isWebSocket(): boolean</code></summary>

判断当前环境是否支持 `WebSocket`。

</details>

<details>
<summary><code>isSharedWorker(): boolean</code></summary>

判断当前环境是否支持 `SharedWorker`。

</details>

### timer

提供基于 Promise 的异步等待工具。

相关测试：暂无专用测试

<details>
<summary><code>sleep(ms?: number): Promise&lt;unknown&gt;</code></summary>

使用 `setTimeout` 与 `Promise` 实现暂停执行若干毫秒。

```ts
await sleep(3000); // 暂停 3 秒
console.log('continue'); // 继续执行
```

</details>

### operator

提供运行时值类型判断工具。

相关测试：[operator.cy.ts](./tests/operator.cy.ts)

<details>
<summary><code>trueTypeOf(obj: unknown): string</code></summary>

检查数据类型。

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

</details>

### decimal

提供基于 `decimal.js-light` 的数值格式化能力。

相关测试：[decimal.cy.ts](./tests/decimal.cy.ts)

<details>
<summary><code>format(value: number | string | undefined | null, options?: FormatOptions): string</code></summary>

格式化数字，默认保留 3 位小数，可添加前缀、后缀，默认值为 `'--'`。更多用法见[测试](./tests/decimal.cy.ts)。

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

</details>

### object

提供对象零值清理与类型安全键名访问辅助函数。

相关测试：[object.cy.ts](./tests/object.cy.ts)

<details>
<summary><code>removeZeroValueKeys = &lt;T extends Record&lt;string, any&gt;&gt;(obj: T, zeroValues = ZeroValues): T</code></summary>

移除零值的键。默认零值包括 `undefined`、`null`、`''`、`NaN`、`[]`、`{}`。

```ts
removeZeroValueKeys({ a: '', b: 'abc', c: undefined, d: null, e: NaN, f: -1, g: [], h: {} });
// { b: 'abc', f: -1 }
```

</details>

<details>
<summary><code>typedKeys(obj: T): Array&lt;keyof T&gt;</code></summary>

返回 `tuple` 类型，而不是 `string[]`。

```ts
const obj = { a: 1, b: '2' };
Object.keys(obj); // string[]
object.typedKeys({ a: 1, b: '2' }); // ('a' | 'b')[]
```

</details>

### array

提供数组移动、序号计算、百分位排名和标准差等实用函数。

相关测试：[array.cy.ts](./tests/array.cy.ts)

<details>
<summary><code>moveImmutable&lt;T&gt;(array: T[], fromIndex: number, toIndex: number): T[]</code></summary>

移动数组元素位置，返回新数组，不修改原数组。

```ts
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

</details>

<details>
<summary><code>moveMutable&lt;T&gt;(array: T[], fromIndex: number, toIndex: number): void</code></summary>

移动数组元素位置，直接修改原数组。

</details>

<details>
<summary><code>moveToStart&lt;T&gt;(array: T[], predicate: (item: T) =&gt; boolean): T[]</code></summary>

将满足条件的元素移动到数组首位，不修改原数组。

```ts
import { array } from '@d-matrix/utils';

const list = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
const newList = array.moveToStart(list, (item) => item.id === 4);

// [{ id: 4 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 5 }]
```

</details>

<details>
<summary><code>moveMulti&lt;T extends unknown&gt;(arr: T[], indexes: number[], start: number): T[]</code></summary>

将多个元素移动到数组中的指定位置。更多用法见[测试用例](./tests/array.cy.ts)。

</details>

<details>
<summary><code>getArrayOrUndefined&lt;T&gt;(array?: T[] | undefined | null): T[] | undefined</code></summary>

如果 `array` 是非空数组则返回该数组，否则返回 `undefined`。更多用法见[测试用例](./tests/array.cy.ts)。

</details>

<details>
<summary><code>calcUnusedMinSerialNumber = &lt;T extends Record&lt;string, unknown&gt;&gt;(list: T[], options: { fieldName: keyof T; prefix: string; defaultNo?: number }): number</code></summary>

从指定列表中提取“前缀 + 数字”格式的值，找到未被使用的最小正整数序号。更多用法见[测试用例](./tests/array.cy.ts)。

</details>

<details>
<summary><code>percentRank(arr: number[], value: number | undefined | null): number | undefined</code></summary>

计算给定值在数组中的百分位排名。函数内部会先对数组做升序排序，再计算结果。

```ts
const arr = [10, 20, 40, 50];

array.percentRank(arr, 30); // 0.5
array.percentRank(arr, 10); // 0
array.percentRank(arr, 50); // 1
```

</details>

<details>
<summary><code>percentRankOfSorted(sorted: number[], value: number | undefined | null): number | undefined</code></summary>

计算给定值在已排序数组中的百分位排名，适用于输入已经是升序数组的场景，避免重复排序。支持精确命中和区间插值，超出范围时返回 `undefined`。更多用法见[测试用例](./tests/array.cy.ts)。

```ts
const sorted = [10, 20, 40, 50];

array.percentRankOfSorted(sorted, 30); // 0.5
array.percentRankOfSorted(sorted, 10); // 0
array.percentRankOfSorted(sorted, 50); // 1
```

</details>

<details>
<summary><code>standardDeviation(arr: number[]): number | undefined</code></summary>

计算数字数组的总体标准差，空数组时返回 `undefined`。更多用法见[测试用例](./tests/array.cy.ts)。

```ts
array.standardDeviation([1, 2, 3, 4, 5]); // 1.4142135623730951
array.standardDeviation([5]); // 0
array.standardDeviation([]); // undefined
```

</details>

### number

提供随机整数、字符串转数值与安全四则运算函数。

相关测试：[number.cy.ts](./tests/number.cy.ts)

<details>
<summary><code>randomInt(min: number, max: number): number</code></summary>

返回 `min` 到 `max` 之间的随机整数。

</details>

<details>
<summary><code>safeMinus(a: number | string | undefined | null, b: number | string | undefined | null): number | undefined</code></summary>

安全减法。支持数字和可转为数字的字符串。任一参数为 `undefined`、`null`、空字符串、空白字符串或非法数字字符串时返回 `undefined`。

```ts
number.safeMinus(5, 2); // 3
number.safeMinus('5', '2'); // 3
number.safeMinus(undefined, 2); // undefined
number.safeMinus('abc', 2); // undefined
```

</details>

<details>
<summary><code>safePlus(a: number | string | undefined | null, b: number | string | undefined | null): number | undefined</code></summary>

安全加法。支持数字和可转为数字的字符串。任一参数为 `undefined`、`null`、空字符串、空白字符串或非法数字字符串时返回 `undefined`。

```ts
number.safePlus(5, 2); // 7
number.safePlus('5', '2'); // 7
number.safePlus(null, 2); // undefined
number.safePlus('', 2); // undefined
```

</details>

<details>
<summary><code>safeMultiply(a: number | string | undefined | null, b: number | string | undefined | null): number | undefined</code></summary>

安全乘法。支持数字和可转为数字的字符串。任一参数为 `undefined`、`null`、空字符串、空白字符串或非法数字字符串时返回 `undefined`。

```ts
number.safeMultiply(5, 2); // 10
number.safeMultiply('5', '2'); // 10
number.safeMultiply(5, undefined); // undefined
number.safeMultiply('   ', 2); // undefined
```

</details>

<details>
<summary><code>safeDivide(a: number | string | undefined | null, b: number | string | undefined | null): number | undefined</code></summary>

安全除法。支持数字和可转为数字的字符串。任一参数为 `undefined`、`null`、空字符串、空白字符串、非法数字字符串，或者除数为 `0`（包括字符串 `'0'`）时返回 `undefined`。

```ts
number.safeDivide(6, 2); // 3
number.safeDivide('6', '2'); // 3
number.safeDivide(1, 0); // undefined
number.safeDivide(1, '0'); // undefined
number.safeDivide(6, null); // undefined
```

</details>

### echarts

提供 ECharts 配置合并、时间序列补点和 Y 轴范围计算工具。

相关测试：[mergeOption.cy.ts](./tests/echarts/mergeOption.cy.ts)、[fill.cy.ts](./tests/echarts/fill.cy.ts)、[calcYAxisRange.cy.ts](./tests/echarts/calcYAxisRange.cy.ts)

<details>
<summary><code>mergeOption(defaults: EChartsOption, overrides: EChartsOption, option?: deepmerge.Options): EChartsOption</code></summary>

deep merge ECharts 配置。更多用法见[测试用例](./tests/echarts/mergeOption.cy.ts)。

</details>

<details>
<summary><code>fill&lt;T extends Record&lt;string, any&gt;, XAxisField extends keyof T, YAxisField extends keyof T&gt;(dataSource: T[], xAxisField: XAxisField, yAxisField: YAxisField): T[]</code></summary>

适用于后端接口只返回部分时间点数据时，按 5 分钟粒度补点。填充点的 Y 轴值沿用前一个点的值。

时间示例：`[9:23, 9:27] => [9:23, 9:25, 9:27, 9:30]`

更多用法见[测试用例](./tests/echarts/fill.cy.ts)，效果图见[折线图](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/Dingtalk_20240724140535.jpg)。

</details>

<details>
<summary><code>calcYAxisRange&lt;T extends Record&lt;string, any&gt;, Key extends keyof T&gt;(data: T[], key: Key, decimalPlaces = 2, splitNumber = 5): { max: number; min: number }</code></summary>

计算 ECharts `YAxis` 的 `max` 和 `min`，使折线图能够根据实际数据动态调整波动范围，并让第一个点始终位于 Y 轴中间位置。效果图见[这里](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/Dingtalk_20240724140535.jpg)。

</details>

### color

提供十六进制颜色与 RGBA 之间的转换能力。

相关测试：[color.cy.ts](./tests/color.cy.ts)

<details>
<summary><code>hexToRGBA(hex: string, alpha: number | string = 1): string</code></summary>

将十六进制颜色转换为 RGBA 颜色。更多用法见[测试用例](./tests/color.cy.ts)。

</details>

### scene

提供多选默认项切换和带空值兜底的排序场景工具。

相关测试：[toggleSelectionValue.cy.ts](./tests/scene/toggleSelectionValue.cy.ts)、[sortRecordsBySortStateNilLast.cy.ts](./tests/scene/sortRecordsBySortStateNilLast.cy.ts)

<details>
<summary><code>toggleSelectionValue&lt;T extends string | number&gt;(params: { selectedValues: T[] | undefined; toggledValue: T; selected: boolean; defaultValue: T; isDefaultSelected: (value: T[] | undefined) =&gt; boolean; }): T[]</code></summary>

切换多选值，并在取消最后一个普通项时回退到默认值。适用于“全部”与普通选项互斥的场景。

```ts
import { scene } from '@d-matrix/utils';

const defaultValue = 'all';
const isDefaultSelected = (value: string[] | undefined) => scene.hasSameSelectionValues(value, [defaultValue]);

scene.toggleSelectionValue({
  selectedValues: [defaultValue],
  toggledValue: 'A',
  selected: true,
  defaultValue,
  isDefaultSelected,
}); // ['A']

scene.toggleSelectionValue({
  selectedValues: ['A'],
  toggledValue: 'A',
  selected: false,
  defaultValue,
  isDefaultSelected,
}); // ['all']
```

</details>

<details>
<summary><code>hasSameSelectionValues&lt;T extends string | number&gt;(selectedValues: T[] | undefined, nextSelectedValues: T[]): boolean</code></summary>

判断两次选中值是否一致。`undefined` 会按空数组处理。

```ts
scene.hasSameSelectionValues(undefined, []); // true
scene.hasSameSelectionValues(['A', 'B'], ['A', 'B']); // true
scene.hasSameSelectionValues(['A', 'B'], ['B', 'A']); // false
```

</details>

<details>
<summary><code>sortRecordsBySortStateNilLast&lt;T extends object&gt;(records: T[] | undefined, sortState: VirtualTableSort | undefined, options?: { getSortValue?: (record: T, field: keyof T) =&gt; unknown; }): T[] | undefined</code></summary>

根据排序状态对记录排序，并将 `null` / `undefined` 放到结果末尾。

```ts
import { scene } from '@d-matrix/utils';

const records = [{ value: 3 }, { value: undefined }, { value: 1 }];

scene.sortRecordsBySortStateNilLast(records, {
  field: 'value',
  direction: scene.VirtualTableSortDirection.ASC,
});
// [{ value: 1 }, { value: 3 }, { value: undefined }]
```

</details>

<details>
<summary><code>VirtualTableSortDirection</code></summary>

排序方向常量。

```ts
scene.VirtualTableSortDirection.NONE; // 0
scene.VirtualTableSortDirection.ASC; // 1
scene.VirtualTableSortDirection.DESC; // -1
```

</details>

<details>
<summary><code>VirtualTableSort</code></summary>

排序状态类型。

```ts
type VirtualTableSort = {
  field: string;
  direction: ValueOf<typeof scene.VirtualTableSortDirection>;
};
```

</details>

## 测试与开发

### 测试

运行全部组件测试：

```bash
npm run cy:component:all
```

运行单个组件测试：

```bash
npm run cy:component -- tests/date.cy.ts
```

运行类型测试：

```bash
npm run test:tsd
```

运行 E2E 测试前，先将 `src` 通过 `tsc` 构建到 `public/dist` 目录：

```bash
npm run build:public
```

启动一个 Web 服务器访问 `public/index.html`，`dist` 目录脚本可通过 `<script type="module" />` 引入：

```bash
npm run start
```

最后启动 Cypress GUI 客户端并选择 E2E 测试：

```bash
npm run cy:open
```

### 本地开发

构建 npm 包输出到 `dist` 目录：

```bash
npm run build
```

启动本地示例页服务：

```bash
npm run start
```

如果需要先为示例页准备 `public/dist` 下的构建产物，请先执行：

```bash
npm run build:public
```

## 发布说明

发布前建议先执行 `npm run build`、`npm run test:tsd`，并按需运行相关 Cypress 测试，确保包产物与类型声明可用。

更新 package 版本：

```bash
npm version <minor> or <major>...
```

构建：

```bash
npm run build
```

发布：

```bash
npm publish --access public
```

网络原因导致连接 registry 服务器超时时，可指定 proxy：

```bash
npm --proxy http://127.0.0.1:7890 publish
```

镜像站查询版本与手动同步：

[npm 镜像站](https://npmmirror.com/package/@d-matrix/utils)

通过 `git log` 命令获取 changelog，用于填写 GitHub Release 内容：

```bash
git log --oneline --decorate
```

## 补充链接

与发布和包维护相关的补充资料：

- [Before Publishing: Make Sure Your Package Installs and Works](https://docs.npmjs.com/cli/v10/using-npm/developers/#before-publishing-make-sure-your-package-installs-and-works)
- [npm-link](https://docs.npmjs.com/cli/v9/commands/npm-link)
- [Creating and publishing scoped public packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages)
