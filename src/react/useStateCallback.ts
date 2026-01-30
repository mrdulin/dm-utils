import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 等价于类组件的 setState(updater[, callback])，支持在状态更新后执行回调函数
 * 该 Hook 扩展了 useState，允许在状态更新完成后执行回调，类似于类组件中的 setState 第二个参数
 *
 * @template T - 状态的类型
 * @param initialState - 状态的初始值
 * @returns 返回一个元组，第一个元素是当前状态值，第二个元素是设置状态的函数（支持回调）
 *
 * @example
 * ```tsx
 * const [count, setCount] = useStateCallback(0);
 *
 * const handleClick = () => {
 *   setCount(count + 1, (newCount) => {
 *     console.log('新的计数值:', newCount);
 *   });
 * };
 * ```
 */
export function useStateCallback<T>(initialState: T): [T, (state: T, cb?: (state: T) => void) => void] {
  const [state, setState] = useState(initialState);
  const cbRef = useRef<((state: T) => void) | undefined>(undefined);

  const setStateCallback = useCallback((state: T, cb?: (state: T) => void) => {
    cbRef.current = cb;
    setState(state);
  }, []);

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = undefined;
    }
  }, [state]);

  return [state, setStateCallback];
}
