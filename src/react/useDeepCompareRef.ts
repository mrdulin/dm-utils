import { DependencyList, useRef } from 'react';

import isEqual from 'react-fast-compare';

/**
 * 使用深度比较来追踪依赖数组变化的 Hook。
 * 当传入的依赖数组发生变化时，返回的 ref 的 current 值会自增。
 * 适用于需要基于复杂对象或数组变化触发副作用的场景。
 *
 * @param deps 依赖数组，会被深度比较
 * @returns 一个 ref，其 current 值在依赖变化时递增
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
