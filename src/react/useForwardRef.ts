import { ForwardedRef, useEffect, useRef } from 'react';

/**
 * 处理 React forwardRef 类型问题的 Hook
 * 该 Hook 解决了在使用 forwardRef 时类型错误：Property 'current' does not exist on type '(instance: HTMLInputElement | null) => void'
 * 适用于在自定义 Hook 中需要同时支持回调 ref 和对象 ref 的场景
 *
 * @template T - ref 指向的元素类型
 * @param ref - 从 forwardRef 接收到的 ref，可以是回调函数或对象
 * @param initialValue - 初始值，默认为 null
 * @returns 返回一个标准的 React MutableRefObject，可以在组件内部使用
 *
 * @see https://stackoverflow.com/questions/66060217/i-cant-type-the-ref-correctly-using-useref-hook-in-typescript
 *
 * @example
 * ```tsx
 * // 在自定义 Hook 中使用
 * function useCustomInput() {
 *   const [value, setValue] = useState('');
 *
 *   return {
 *     value,
 *     onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)
 *   };
 * }
 *
 * // 在组件中使用
 * const CustomInput = React.forwardRef<HTMLInputElement, {
 *   label: string;
 * }>(({ label }, ref) => {
 *   const inputRef = useForwardRef(ref);
 *   const { value, onChange } = useCustomInput();
 *
 *   return (
 *     <div>
 *       <label>{label}</label>
 *       <input
 *         ref={inputRef}
 *         value={value}
 *         onChange={onChange}
 *       />
 *     </div>
 *   );
 * });
 *
 * // 使用 CustomInput 组件
 * function App() {
 *   // 回调 ref
 *   const handleRef = (instance: HTMLInputElement | null) => {
 *     if (instance) {
 *       console.log('Input element:', instance);
 *     }
 *   };
 *
 *   // 或对象 ref
 *   // const inputRef = useRef<HTMLInputElement>(null);
 *
 *   return (
 *     <div>
 *       <CustomInput label="Username" ref={handleRef} />
 *       <CustomInput label="Username" ref={inputRef} />
 *     </div>
 *   );
 * }
 * ```
 */
export const useForwardRef = <T>(ref: ForwardedRef<T>, initialValue: any = null): React.MutableRefObject<T> => {
  const targetRef = useRef<T>(initialValue);

  useEffect(() => {
    if (!ref) return;

    if (typeof ref === 'function') {
      ref(targetRef.current);
    } else {
      ref.current = targetRef.current;
    }
  }, [ref]);

  return targetRef;
};
