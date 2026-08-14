import { useState } from 'react';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

type UseMediaQueryOptions = {
  /**
   * Hook 在服务端运行时返回的默认值。
   * @default false
   */
  defaultValue?: boolean;
  /**
   * 是否在初始化时读取媒体查询。SSR 场景下建议设为 `false`，首次渲染将返回 `defaultValue`。
   * @default true
   */
  initializeWithValue?: boolean;
};

const IS_SERVER = typeof window === 'undefined';

/**
 * 判断当前视口是否匹配指定的媒体查询。
 *
 * @param query - 传给 `window.matchMedia` 的 CSS 媒体查询条件，不包含 `@media`，例如 `(min-width: 768px)` 或 `(max-width: 767px)`。
 * @param [options] - Hook 的初始化配置。
 * @param [options.defaultValue=false] - 服务端运行时返回的默认匹配结果。
 * @param [options.initializeWithValue=true] - 是否在初始化时读取媒体查询；SSR 场景下建议设为 `false`。
 *
 * @example
 * ```tsx
 * const isViewportAtLeast768PixelsWide = useMediaQuery('(min-width: 768px)', {
 *   defaultValue: false,
 *   initializeWithValue: false,
 * });
 * const isViewportAtMost767PixelsWide = useMediaQuery('(max-width: 767px)');
 * ```
 */
export function useMediaQuery(query: string, options: UseMediaQueryOptions = {}): boolean {
  const { defaultValue = false, initializeWithValue = true } = options;

  const getMatches = (query: string): boolean => {
    if (IS_SERVER) {
      return defaultValue;
    }
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(query);
    }
    return defaultValue;
  });

  // Handles the change event of the media query.
  function handleChange() {
    setMatches(getMatches(query));
  }

  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query);

    // Triggered at the first client-side load and if query changes
    handleChange();

    // Use deprecated `addListener` and `removeListener` to support Safari < 14 (#135)
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else {
      matchMedia.addEventListener('change', handleChange);
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else {
        matchMedia.removeEventListener('change', handleChange);
      }
    };
  }, [query]);

  return matches;
}
