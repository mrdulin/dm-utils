/**
 * 将元素的滚动条平滑滚动到顶部位置
 *
 * 此函数首先检查元素是否存在，然后判断元素是否已经在顶部（scrollTop === 0），
 * 如果不在顶部，则使用现代浏览器的 scrollTo API 或回退到直接设置 scrollTop 属性，
 * 以兼容旧版浏览器。
 *
 * @param {Element | null | undefined} element - 要滚动到顶部的目标元素，如果为 null 或 undefined 则直接返回
 * @returns {void} 无返回值
 * @since 1.0.0
 * @category DOM Manipulation
 * @example
 * // 滚动到页面顶部
 * scrollToTop(document.documentElement);
 *
 * @example
 * // 滚动到特定容器的顶部
 * const container = document.getElementById('myContainer');
 * scrollToTop(container);
 *
 * @example
 * // 处理可能不存在的元素
 * scrollToTop(null); // 不执行任何操作
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
 * 使用 DOMParser API 将HTML字符串解析为DOM文档，
 * 然后提取其中的文本内容，去除所有HTML标签和标记。
 * 这种方法比正则表达式更安全，可以正确处理各种HTML实体和嵌套结构。
 *
 * @param {string} html - 需要处理的HTML字符串
 * @returns {string} 提取的纯文本内容，如果无法提取则返回空字符串
 * @since 1.0.0
 * @category DOM Parsing
 * @example
 * const htmlString = '<p>Hello <strong>World</strong>!</p>';
 * const text = strip(htmlString);
 * console.log(text); // 'Hello World!'
 *
 * @example
 * // 处理包含HTML实体的字符串
 * const htmlWithEntities = '&lt;p&gt;Text with &amp; entities&lt;/p&gt;';
 * const plainText = strip(htmlWithEntities);
 * console.log(plainText); // 'Text with & entities'
 */
export function strip(html: string): string {
  let doc = new DOMParser().parseFromString(html ?? '', 'text/html');
  return doc.body.textContent || '';
}

/**
 * 将HTML字符串中的RGB和RGBA颜色值转换为十六进制颜色值
 *
 * 使用正则表达式匹配HTML字符串中的rgb()和rgba()颜色函数，
 * 将其转换为对应的十六进制格式（#RRGGBB或#RRGGBBAA）。
 * 此函数会规范化RGB分量值，处理百分比和负数等边界情况。
 *
 * @param {string} htmlStr - 包含RGB/RGBA颜色值的HTML字符串
 * @returns {string} 将所有RGB/RGBA颜色值转换为十六进制格式的HTML字符串
 * @since 1.0.0
 * @category DOM Processing
 * @example
 * const htmlWithRgb = '<div style="color: rgb(255, 0, 0); background: rgba(0, 255, 0, 0.5)">Text</div>';
 * const convertedHtml = convertRgbToHexInHtml(htmlStr);
 * console.log(convertedHtml); // '<div style="color: #FF0000; background: #00FF0080">Text</div>'
 *
 * @example
 * // 处理包含百分比值的RGB颜色
 * const htmlWithPct = '<span style="color: rgb(50%, 100%, 0%)">Text</span>';
 * const convertedPct = convertRgbToHexInHtml(htmlWithPct);
 * console.log(convertedPct); // '<span style="color: #7F00FF">Text</span>'
 */
/**
 * 规范化单个RGB分量值
 *
 * 此函数处理两种格式的输入：
 * 1. 百分数格式（如 "50%"）- 将其限制在0-100%范围内，然后转换为0-255范围
 * 2. 数字格式（如 "128"）- 将其限制在0-255范围内
 *
 * @param {string} valueStr - RGB分量的字符串表示，可以是百分比或数值（例如 "50%" 或 "128"）
 * @returns {number} 转换后的0-255范围内的整数值
 * @private
 * @since 1.0.0
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

/**
 * 规范化alpha透明度值
 *
 * 将alpha值限制在0-1范围内，然后转换为0-255范围内的整数，
 * 用于十六进制颜色值的alpha通道表示。
 *
 * @param {string} alphaStr - alpha透明度的字符串表示（例如 "0.5" 或 "1"）
 * @returns {number} 转换后的0-255范围内的整数值
 * @private
 * @since 1.0.0
 */
const normalizeAlpha = (alphaStr: string): number => {
  const alpha = parseFloat(alphaStr);
  const clampedAlpha = Math.max(0, Math.min(1, alpha));
  return Math.round(clampedAlpha * 255);
};

/**
 * 将数字转换为两位大写十六进制字符串
 *
 * 将0-255范围内的数字转换为两位大写的十六进制字符串，
 * 不足两位的前面补0。
 *
 * @param {number} num - 要转换的数字，应在0-255范围内
 * @returns {string} 两位大写十六进制字符串（例如 "FF", "0A", "00"）
 * @private
 * @since 1.0.0
 */
const toHex = (num: number): string => num.toString(16).padStart(2, '0').toUpperCase();

export function convertRgbToHexInHtml(htmlStr: string): string {
  // Fixed regex: added -? to match negative numbers (e.g., -50)
  const rgbPattern =
    /rgba?\(\s*(-?\d+(?:\.\d+)?%?)\s*,\s*(-?\d+(?:\.\d+)?%?)\s*,\s*(-?\d+(?:\.\d+)?%?)\s*(?:,\s*(-?\d+(?:\.\d+)?))?\s*\)/gi;

  return htmlStr.replace(rgbPattern, (match, rVal, gVal, bVal, aVal) => {
    // 处理R/G/B组件
    const r = normalizeRgbComponent(rVal);
    const g = normalizeRgbComponent(gVal);
    const b = normalizeRgbComponent(bVal);

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

type CssSizeValue = string | number;

export type MeasureTextByDomOptions = {
  text: string;
  minWidth?: CssSizeValue;
  maxWidth?: CssSizeValue;
  fontSize?: CSSStyleDeclaration['fontSize'];
  fontFamily?: CSSStyleDeclaration['fontFamily'];
  fontWeight?: CSSStyleDeclaration['fontWeight'];
  fontStyle?: CSSStyleDeclaration['fontStyle'];
  lineHeight?: CssSizeValue;
};

export type TextSize = {
  width: number;
  height: number;
};

const assignCssSize = (style: CSSStyleDeclaration, property: 'maxWidth' | 'minWidth' | 'lineHeight', value?: CssSizeValue) => {
  style[property] = value == null ? '' : typeof value === 'number' ? `${value}px` : value;
};

/**
 * 文本测量器实例。
 *
 * @property {Function} measure 计算文本尺寸。
 * @property {Function} dispose 释放测量容器。
 */
export type TextMeasurer = {
  measure: (options: MeasureTextByDomOptions) => TextSize;
  dispose: () => void;
};

/**
 * 创建文本测量器。
 *
 * 测量器会复用一个隐藏的 DOM 容器，避免每次测量都创建和移除节点。
 * 不再需要测量时调用 `dispose()`，释放内部缓存的测量容器。
 *
 * @returns {TextMeasurer} 文本测量器实例
 * @example
 * const measurer = createTextMeasurer();
 * const size = measurer.measure({
 *   text: '测试文本',
 *   fontSize: '14px',
 *   fontFamily: 'Arial',
 *   maxWidth: 120,
 *   lineHeight: '20px',
 * });
 *
 * console.log(size.width, size.height);
 * measurer.dispose();
 *
 * @example
 * function TextWidthPreview() {
 *   const measurer = React.useMemo(() => createTextMeasurer(), []);
 *   const [width, setWidth] = React.useState(0);
 *
 *   React.useEffect(() => {
 *     const size = measurer.measure({
 *       text: '示例文本',
 *       fontSize: '14px',
 *       fontFamily: 'Arial',
 *       maxWidth: 120,
 *       lineHeight: '20px',
 *     });
 *
 *     setWidth(size.width);
 *
 *     return () => {
 *       measurer.dispose();
 *     };
 *   }, [measurer]);
 *
 *   return <div>{`width: ${width}px`}</div>;
 * }
 */
export const createTextMeasurer = (): TextMeasurer => {
  let measureTextContainer: HTMLDivElement | null = null;

  const removeMeasureTextContainer = () => {
    if (measureTextContainer?.parentNode) {
      measureTextContainer.parentNode.removeChild(measureTextContainer);
    }

    measureTextContainer = null;
  };

  const getMeasureTextContainer = () => {
    if (measureTextContainer && measureTextContainer.ownerDocument === document && measureTextContainer.isConnected) {
      return measureTextContainer;
    }

    if (measureTextContainer) {
      removeMeasureTextContainer();
    }

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.visibility = 'hidden';
    container.style.top = '0px';
    container.style.left = '0px';
    document.body.appendChild(container);
    measureTextContainer = container;
    return container;
  };

  const measure = (options: MeasureTextByDomOptions) => {
    const { text, minWidth, maxWidth, lineHeight } = options;
    const fontSize = options.fontSize || '12px';
    const fontFamily = options.fontFamily || 'Arial';
    const fontWeight = options.fontWeight || 'normal';
    const fontStyle = options.fontStyle || 'normal';
    const container = getMeasureTextContainer();
    assignCssSize(container.style, 'maxWidth', maxWidth);
    assignCssSize(container.style, 'minWidth', minWidth);
    container.style.fontSize = fontSize;
    container.style.fontFamily = fontFamily;
    container.style.fontWeight = fontWeight;
    container.style.fontStyle = fontStyle;
    assignCssSize(container.style, 'lineHeight', lineHeight);
    container.innerText = text;
    const { width, height } = container.getBoundingClientRect();
    return { width, height };
  };

  return {
    measure,
    dispose: removeMeasureTextContainer,
  };
};
