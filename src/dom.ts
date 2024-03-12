/**
 * 元素滚动条滚动到顶部
 */
export function scrollToTop(element: Element | null | undefined): void {
  if (element) {
    if (element.scrollTop === 0) {
      return;
    }
    // 兼容低版本浏览器
    if (typeof element.scrollTo === 'function') {
      element.scrollTo({ top: 0 });
    } else {
      element.scrollTop = 0;
    }
  }
}
