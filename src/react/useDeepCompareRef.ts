import { DependencyList, useRef } from 'react';

import isEqual from 'react-fast-compare';

export const useDeepCompareRef = (deps: DependencyList): React.MutableRefObject<number> => {
  const ref = useRef<DependencyList>();
  const signalRef = useRef<number>(0);

  if (deps === undefined || !isEqual(deps, ref.current)) {
    ref.current = deps;
    signalRef.current += 1;
  }

  return signalRef;
};
