import { useEffect, useLayoutEffect } from 'react';

/**
 * 在浏览器环境中使用 useLayoutEffect，在服务器环境中使用 useEffect
 * 该 Hook 确保在浏览器环境中使用布局效果（如 DOM 操作）时，不会阻塞渲染
 * 在服务器环境中（如 Next.js 中的服务器渲染），则使用普通的 useEffect 避免错误
 *
 * @returns 返回一个与 useLayoutEffect 或 useEffect 相同的函数，具体取决于环境
 *
 * @example
 * ```tsx
 * useIsomorphicLayoutEffect(() => {
 *   // 仅在浏览器环境中执行布局效果
 *   console.log('组件挂载或更新');
 * }, [dependency]);
 * ```
 */
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
