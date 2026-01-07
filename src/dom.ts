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

/**
 * 将 HTML 字符串中的 rgb/rgba 颜色转换为 hex 格式
 * @param htmlStr 包含 rgb/rgba 颜色的 HTML 字符串
 * @returns 转换后的 HTML 字符串
 */
export function convertRgbToHexInHtml(htmlStr: string): string {
  // Fixed regex: added -? to match negative numbers (e.g., -50)
  const rgbPattern =
    /rgba?\(\s*(-?\d+(?:\.\d+)?%?)\s*,\s*(-?\d+(?:\.\d+)?%?)\s*,\s*(-?\d+(?:\.\d+)?%?)\s*(?:,\s*(-?\d+(?:\.\d+)?))?\s*\)/gi;

  return htmlStr.replace(rgbPattern, (match, rVal, gVal, bVal, aVal) => {
    // Normalize single RGB component (clamping logic)
    const normalizeRgbComponent = (valueStr: string): number => {
      const isPercentage = valueStr.endsWith('%');
      let rawValue = parseFloat(valueStr.replace('%', ''));

      if (isPercentage) {
        // Clamp percentage to 0-100% then convert to 0-255
        rawValue = Math.max(0, Math.min(100, rawValue));
        return Math.floor((rawValue / 100) * 255);
      } else {
        // Clamp numeric RGB to 0-255 (fixes 300→255, -50→0)
        rawValue = Math.max(0, Math.min(255, rawValue));
        return Math.trunc(rawValue);
      }
    };

    // Normalize alpha (clamp 0-1)
    const normalizeAlpha = (alphaStr: string): number => {
      const alpha = parseFloat(alphaStr);
      const clampedAlpha = Math.max(0, Math.min(1, alpha));
      return Math.round(clampedAlpha * 255);
    };

    // Process R/G/B components
    const r = normalizeRgbComponent(rVal);
    const g = normalizeRgbComponent(gVal);
    const b = normalizeRgbComponent(bVal);

    // Convert to 2-digit uppercase hex
    const toHex = (num: number): string => num.toString(16).padStart(2, '0').toUpperCase();
    const hexRGB = `${toHex(r)}${toHex(g)}${toHex(b)}`;

    // Handle alpha (RGBA case)
    if (aVal) {
      const alphaHex = toHex(normalizeAlpha(aVal));
      return `#${hexRGB}${alphaHex}`;
    }

    // RGB case (no alpha)
    return `#${hexRGB}`;
  });
}
