import { ForwardedRef, useEffect, useRef } from 'react';

/**
 * https://stackoverflow.com/questions/66060217/i-cant-type-the-ref-correctly-using-useref-hook-in-typescript
 * 解决 Property 'current' does not exist on type '(instance: HTMLInputElement | null) => void' TS类型错误
 * @param ref
 * @param initialValue
 * @returns
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
