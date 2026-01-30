import * as React from 'react';
import { useCallback } from 'react';

// allow the hook to work in SSR
const useLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

/**
 * 替代 useCallback 的 Hook，当依赖项变化时不会更新回调函数引用
 * 该 Hook 解决了 useCallback 在依赖项频繁变化时回调函数引用也会变化的问题
 * 适用于需要稳定回调函数引用的场景，如事件处理器
 *
 * @template Args - 回调函数参数的类型数组
 * @template Return - 回调函数返回值的类型
 * @param fn - 要包装的回调函数
 * @returns 返回一个稳定的回调函数引用，该引用不会随依赖项变化而变化
 *
 * @see https://reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback
 * @see https://github.com/facebook/react/issues/14099#issuecomment-440013892
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const [count, setCount] = useState(0);
 *
 *   // 这个回调函数的引用是稳定的，即使 count 变化
 *   const handleClick = useEventCallback(() => {
 *     console.log('Current count:', count);
 *   });
 *
 *   useEffect(() => {
 *     // 只在组件挂载时添加一次事件监听
 *     window.addEventListener('resize', handleClick);
 *     return () => window.removeEventListener('resize', handleClick);
 *   }, [handleClick]); // handleClick 引用稳定，所以依赖项数组只在挂载时变化
 *
 *   return (
 *     <div>
 *       <p>Count: {count}</p>
 *       <button onClick={() => setCount(count + 1)}>Increment</button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useEventCallback = <Args extends unknown[], Return>(fn: (...args: Args) => Return): ((...args: Args) => Return) => {
  const ref = React.useRef<(...args: Args) => Return>(() => {
    throw new Error('Cannot call an event handler while rendering.');
  });

  useLayoutEffect(() => {
    ref.current = fn;
  });

  return useCallback((...args: Args) => ref.current(...args), []);
};
