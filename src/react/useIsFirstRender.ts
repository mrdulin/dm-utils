import { useRef } from 'react';

/**
 * 使用 useIsFirstRender 区分第一次和后续渲染
 * useIsFirstRender 对于确定当前渲染是否是组件的第一个渲染很有用。当你想在初始渲染时有条件地执行某些逻辑或渲染特定组件时，这个钩子特别有价值，提供了一种有效的方法来区分第一次和后续渲染。
 * @returns boolean true 表示第一次渲染，false 表示其他渲染
 */
export function useIsFirstRender() {
  const renderRef = useRef(true);

  if (renderRef.current === true) {
    renderRef.current = false;
    return true;
  }

  return renderRef.current;
}
