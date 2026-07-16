import { DependencyList, useCallback, useRef } from 'react';

import isEqual from 'react-fast-compare';

export interface VersionGuard {
  /** 捕获当前上下文版本，用于异步任务发起时记录快照。 */
  captureVersion(): number;

  /** 判断传入版本是否仍是当前上下文版本，用于过滤过期异步结果。 */
  isCurrentVersion(version: number): boolean;
}

/**
 * 创建基于依赖列表的版本守卫，用于在异步回调返回时判断结果是否仍属于当前上下文。
 *
 * 使用场景：搜索条件、路由参数或资源 ID 切换后，忽略旧请求、旧定时器等过期异步结果。
 *
 * @example
 * function UserProfile({ userId }: { userId: string }) {
 *   const [name, setName] = React.useState('');
 *   const { captureVersion, isCurrentVersion } = useVersionGuard([userId]);
 *
 *   React.useEffect(() => {
 *     const version = captureVersion();
 *
 *     fetch(`/api/users/${userId}`)
 *       .then((response) => response.json())
 *       .then((user: { name: string }) => {
 *         if (isCurrentVersion(version)) {
 *           setName(user.name);
 *         }
 *       });
 *   }, [captureVersion, isCurrentVersion, userId]);
 *
 *   return <div>{name}</div>;
 * }
 *
 * @param deps - 用于区分当前业务上下文的依赖列表。依赖值变化时内部版本号会自增。
 * @returns 包含版本捕获函数和版本校验函数的对象。
 */
export const useVersionGuard = (deps: DependencyList): VersionGuard => {
  const contextRef = useRef({ deps, version: 0 });

  if (!isEqual(contextRef.current.deps, deps)) {
    contextRef.current = {
      deps,
      version: contextRef.current.version + 1,
    };
  }

  const captureVersion = useCallback(() => {
    return contextRef.current.version;
  }, []);

  const isCurrentVersion = useCallback((version: number) => {
    return contextRef.current.version === version;
  }, []);

  return {
    captureVersion,
    isCurrentVersion,
  };
};
