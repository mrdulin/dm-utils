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
 * 从HTML字符串中提取纯文本内容
 *
 * @param html - 需要处理的HTML字符串，可能为null或undefined
 * @returns 提取的纯文本内容，如果无法提取则返回空字符串
 */
export function strip(html: string): string {
  let doc = new DOMParser().parseFromString(html ?? '', 'text/html');
  return doc.body.textContent || '';
}

/**
 * 将HTML字符串中的RGB和RGBA颜色值转换为十六进制颜色值
 *
 * @param htmlStr - 包含RGB/RGBA颜色值的HTML字符串
 * @returns 将所有RGB/RGBA颜色值转换为十六进制格式的HTML字符串
 */
export function convertRgbToHexInHtml(htmlStr: string): string {
  // Fixed regex: added -? to match negative numbers (e.g., -50)
  const rgbPattern =
    /rgba?\(\s*(-?\d+(?:\.\d+)?%?)\s*,\s*(-?\d+(?:\.\d+)?%?)\s*,\s*(-?\d+(?:\.\d+)?%?)\s*(?:,\s*(-?\d+(?:\.\d+)?))?\s*\)/gi;

  return htmlStr.replace(rgbPattern, (match, rVal, gVal, bVal, aVal) => {
    /**
     * 规范化单个RGB分量值
     *
     * 此函数处理两种格式的输入：
     * 1. 百分数格式（如 "50%"）- 将其限制在0-100%范围内，然后转换为0-255范围
     * 2. 数字格式（如 "128"）- 将其限制在0-255范围内
     *
     * @param valueStr - RGB分量的字符串表示，可以是百分比或数值（例如 "50%" 或 "128"）
     * @returns 转换后的0-255范围内的整数值
     */
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

    // 标准化alpha值（范围限制在0-1之间）
    const normalizeAlpha = (alphaStr: string): number => {
      const alpha = parseFloat(alphaStr);
      const clampedAlpha = Math.max(0, Math.min(1, alpha));
      return Math.round(clampedAlpha * 255);
    };

    // 处理R/G/B组件
    const r = normalizeRgbComponent(rVal);
    const g = normalizeRgbComponent(gVal);
    const b = normalizeRgbComponent(bVal);

    // 转换为2位大写十六进制
    const toHex = (num: number): string => num.toString(16).padStart(2, '0').toUpperCase();
    const hexRGB = `${toHex(r)}${toHex(g)}${toHex(b)}`;

    // 处理alpha值（RGBA情况）
    if (aVal) {
      const alphaHex = toHex(normalizeAlpha(aVal));
      return `#${hexRGB}${alphaHex}`;
    }

    // RGB情况（无alpha值）
    return `#${hexRGB}`;
  });
}
