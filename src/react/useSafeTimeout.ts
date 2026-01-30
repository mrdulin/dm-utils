import { useCallback, useEffect, useRef } from 'react';

type SetTimeout = (handler: TimerHandler, timeout?: number, ...args: unknown[]) => number;
type ClearTimeout = (id: number) => void;

/**
 * 在组件中安全地调用 setTimeout 和 clearTimeout 的 Hook
 * 该 Hook 确保所有定时器在组件卸载时都会被自动清除，避免内存泄漏和组件卸载后执行回调导致的错误
 *
 * @returns 返回一个包含 safeSetTimeout 和 safeClearTimeout 函数的对象
 * - safeSetTimeout: 安全的 setTimeout 函数，返回定时器 ID
 * - safeClearTimeout: 安全的 clearTimeout 函数，用于清除指定定时器
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { safeSetTimeout, safeClearTimeout } = useSafeTimeout();
 *   const [message, setMessage] = useState('');
 *
 *   const showMessage = () => {
 *     const timerId = safeSetTimeout(() => {
 *       setMessage('操作成功！');
 *     }, 2000);
 *
 *     // 如果需要提前清除
 *     // safeClearTimeout(timerId);
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={showMessage}>显示消息</button>
 *       {message && <p>{message}</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useSafeTimeout(): { safeSetTimeout: SetTimeout; safeClearTimeout: ClearTimeout } {
  const timers = useRef<Set<number>>(new Set<number>());

  const safeSetTimeout = useCallback((handler: TimerHandler, timeout?: number | undefined, ...args: unknown[]): number => {
    const id = window.setTimeout(handler, timeout, ...args);
    timers.current.add(id);
    return id;
  }, []);

  const safeClearTimeout = useCallback((id: number) => {
    clearTimeout(id);
    timers.current.delete(id);
  }, []);

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-compiler/react-compiler
      // eslint-disable-next-line react-hooks/exhaustive-deps
      for (const id of timers.current) {
        clearTimeout(id);
      }
    };
  }, []);

  return { safeSetTimeout, safeClearTimeout };
}
