import { useCallback, useEffect, useRef } from 'react';

/** 用于判断组件是否挂载 */
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
