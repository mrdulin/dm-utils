import { useCallback, useEffect, useRef } from 'react';

/**
 * 检查组件是否已挂载的 Hook
 * 返回一个函数，用于在异步操作中判断组件是否仍然挂载，避免在组件卸载后执行状态更新
 *
 * @returns 返回一个函数，调用该函数返回布尔值，表示组件是否已挂载
 *
 * @example
 * ```tsx
 * const isMounted = useIsMounted();
 *
 * useEffect(() => {
 *   const fetchData = async () => {
 *     const data = await api.getData();
 *     if (isMounted()) {
 *       setState(data);
 *     }
 *   };
 *   fetchData();
 * }, []);
 * ```
 */
export function useIsMounted(): () => boolean {
  const mountedRef = useRef(false);
  const get = useCallback(() => mountedRef.current, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return get;
}
