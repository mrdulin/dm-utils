import { useRef } from 'react';

/**
 * 检查组件是否为首次渲染的 Hook
 * 该 Hook 返回一个布尔值，仅在组件首次渲染时为 true，后续渲染时为 false
 * 常用于在首次渲染时执行特定逻辑，避免在每次渲染时重复执行
 *
 * @returns 返回布尔值，true 表示首次渲染，false 表示后续渲染
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isFirstRender = useIsFirstRender();
 *
 *   useEffect(() => {
 *     if (isFirstRender) {
 *       console.log('这是首次渲染');
 *       // 仅在首次渲染时执行的逻辑
 *     }
 *   });
 *
 *   return <div>组件内容</div>;
 * }
 * ```
 */
export function useIsFirstRender() {
  const renderRef = useRef(true);

  if (renderRef.current === true) {
    renderRef.current = false;
    return true;
  }

  return renderRef.current;
}
