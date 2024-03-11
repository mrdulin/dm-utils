import { ReactElement } from 'react';
import ReactDOM from 'react-dom';

let container: HTMLDivElement | null;
export const render = <P>(element: ReactElement<P>) => {
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
