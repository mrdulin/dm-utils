import { useEffect, useRef } from 'react';

const defaultContextMenuTarget = () => document;
type ContextMenuTarget = () => Element | Document | undefined | null;
/**
 * 在HTML元素上禁用右键菜单
 * @param target 默认为 () => document
 */
export const useDisableContextMenu = (target: ContextMenuTarget = defaultContextMenuTarget) => {
  const targetFn = useRef(target);
  targetFn.current = target;

  useEffect(() => {
    const el = targetFn.current();
    if (!el) return;
    const onContextMenu = (e: Event) => {
      e.preventDefault();
    };
    el.addEventListener('contextmenu', onContextMenu);
    return () => {
      if (!el) return;
      el.removeEventListener('contextmenu', onContextMenu);
    };
  }, []);
};
