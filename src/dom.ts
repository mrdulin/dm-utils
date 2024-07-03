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

/**
 * Strips HTML tags from a given string and returns the plain text content.
 *
 * @param {string} html - The HTML string to strip tags from.
 * @return {string} The plain text content of the HTML string.
 */
export function strip(html: string): string {
  let doc = new DOMParser().parseFromString(html ?? '', 'text/html');
  return doc.body.textContent || '';
}
