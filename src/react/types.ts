import type {
  ForwardRefExoticComponent,
  NamedExoticComponent,
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  RefAttributes,
  ElementType,
} from 'react';

/**
 * 从元素类型推断 ref 类型
 * 该类型用于从 React 元素类型中提取 ref 的类型，支持 NamedExoticComponent 和普通组件
 *
 * @template T - React 元素类型
 * @returns 返回 ref 的类型
 *
 * @example
 * ```typescript
 * const MyComponent = React.forwardRef<HTMLDivElement>((props, ref) => {
 *   return <div ref={ref} />;
 * });
 *
 * type RefType = ComponentRef<typeof MyComponent>; // HTMLDivElement
 * ```
 */
export type ComponentRef<T extends ElementType> =
  T extends NamedExoticComponent<ComponentPropsWithoutRef<T> & RefAttributes<infer Method>>
    ? Method
    : ComponentPropsWithRef<T> extends RefAttributes<infer Method>
      ? Method
      : never;

/**
 * 从 ForwardRefExoticComponent 推断 ref 类型
 * 该类型用于从 forwardRef 创建的组件中推断 ref 的类型
 *
 * @template T - ForwardRefExoticComponent 类型
 * @returns 返回 ref 元素的类型
 *
 * @example
 * ```typescript
 * const MyInput = React.forwardRef<HTMLInputElement>((props, ref) => {
 *   return <input ref={ref} />;
 * });
 *
 * type InputRefType = InferRef<typeof MyInput>; // HTMLInputElement
 * ```
 */
// https://stackoverflow.com/a/76735017/6463558
export type InferRef<T> =
  T extends ForwardRefExoticComponent<infer Ref> ? (Ref extends React.RefAttributes<infer RefElement> ? RefElement : never) : never;

/**
 * React ref 组件类型
 * 定义一个包含 ref 属性的 React 组件类型
 *
 * @template Props - 组件的 props 类型，必须包含 ref 属性
 */
type ReactRefComponent<Props extends { ref?: React.Ref<any> | string }> = (props: Props) => React.ReactNode;

/**
 * 从 RefAttributes 提取 ref 类型
 * 该类型用于从包含 RefAttributes 的类型中提取 ref 的类型
 *
 * @template T - 包含 RefAttributes 的类型
 * @returns 返回 ref 的类型
 */
type ExtractRefAttributesRef<T> = T extends React.RefAttributes<infer P> ? P : never;

/**
 * 获取组件的 ref 类型
 * 该类型用于从 React 组件或组件类型中提取 ref 的类型
 * 支持类组件和函数组件
 *
 * @template T - React 组件或组件类型
 * @returns 返回组件实例或 ref 的类型
 *
 * @example
 * ```typescript
 * // 类组件
 * class MyClassComponent extends React.Component {
 *   render() { return <div />; }
 * }
 * type ClassRef = GetRef<typeof MyClassComponent>; // MyClassComponent
 *
 * // 函数组件
 * const MyFuncComponent = React.forwardRef<HTMLDivElement>((props, ref) => {
 *   return <div ref={ref} />;
 * });
 * type FuncRef = GetRef<typeof MyFuncComponent>; // HTMLDivElement
 * ```
 */
export type GetRef<T extends ReactRefComponent<any> | React.Component<any>> =
  T extends React.Component<any> ? T : T extends React.ComponentType<infer P> ? ExtractRefAttributesRef<P> : never;
