import { DependencyList, useRef } from 'react';

import isEqual from 'react-fast-compare';

/**
 * 对依赖项进行深度比较的 Hook，返回一个信号引用，当依赖项发生变化时递增
 * 该 Hook 适用于基于复杂对象或数组的深度相等性来触发 effect 或重新渲染
 *
 * @param deps - 需要进行深度比较的依赖项列表，可以是 undefined
 * @returns 返回一个包含信号数字的可变引用对象，每次依赖项变化时该数字会递增
 *
 * @example
 * ```tsx
 * const signal = useDeepCompareRef([complexObject, nestedArray]);
 * useEffect(() => {
 *   console.log('依赖项已变化:', signal.current);
 * }, [signal.current]);
 * ```
 */
export const useDeepCompareRef = (deps: DependencyList): React.MutableRefObject<number> => {
  const ref = useRef<DependencyList>();
  const signalRef = useRef<number>(0);

  if (deps === undefined || !isEqual(deps, ref.current)) {
    ref.current = deps;
    signalRef.current += 1;
  }

  return signalRef;
};
