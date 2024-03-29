import { ReactElement, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

let container: HTMLDivElement | null;
export const render = <P>(element: ReactElement<P>): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (document === undefined) {
      return reject('只支持浏览器环境');
    }
    container = document.createElement('div');
    container.id = 'template-container';
    container.style.cssText = 'position: absolute; left: -9999px;';
    document.body.appendChild(container);
    ReactDOM.render(element, container, () => {
      if (container) {
        resolve(container.innerHTML);
      } else {
        reject('组件容器不存在');
      }
    });
  });
};

export const cleanup = () => {
  if (container === null) return;
  const isUnmounted = ReactDOM.unmountComponentAtNode(container);
  if (isUnmounted) {
    document.body.removeChild(container);
    container = null;
  }
};

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
