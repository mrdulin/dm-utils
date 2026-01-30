/**
 * 将十六进制颜色值转换为 RGBA 颜色字符串
 *
 * 此函数支持标准的 6 位十六进制颜色（如 #ff0000）以及简写的 3 位格式（如 #f00），
 * 并允许指定透明度值。输入的颜色值会经过验证，确保符合十六进制颜色格式要求。
 *
 * @param {string} hex - 十六进制颜色值，支持 3 位或 6 位格式，可带或不带井号前缀
 * @param {number | string} [alpha=1] - 透明度值，范围为 0 到 1，可以是数字或可转换为数字的字符串
 * @returns {string} 格式为 'rgba(r, g, b, a)' 的 RGBA 颜色字符串
 * @throws {Error} 当输入的十六进制颜色格式无效时抛出错误
 * @throws {Error} 当透明度值不是有效数字或超出 0-1 范围时抛出错误
 * @since 1.0.0
 * @example
 * // 标准 6 位十六进制颜色
 * hexToRGBA('#ff0000', 0.5); // 'rgba(255, 0, 0, 0.5)'
 *
 * @example
 * // 简写 3 位十六进制颜色
 * hexToRGBA('#f00', 1); // 'rgba(255, 0, 0, 1)'
 *
 * @example
 * // 不带井号前缀
 * hexToRGBA('00ff00', 0.8); // 'rgba(0, 255, 0, 0.8)'
 *
 * @example
 * // 透明度为 0
 * hexToRGBA('#0000ff', 0); // 'rgba(0, 0, 255, 0)'
 */
export function hexToRGBA(hex: string, alpha: number | string = 1): string {
  // 移除井号并转为小写
  const processedHex = hex.replace(/^#/, '').toLowerCase();

  // 验证十六进制字符合法性
  if (!/^[0-9a-f]+$/.test(processedHex)) {
    throw new Error('Invalid hex character(s)');
  }

  // 验证长度合法性
  if (![3, 6].includes(processedHex.length)) {
    throw new Error('Hex must be 3 or 6 characters long');
  }

  // 扩展三位缩写为六位
  const fullHex =
    processedHex.length === 3
      ? processedHex
          .split('')
          .map((c) => c + c)
          .join('')
      : processedHex;

  // 解析颜色通道
  const parseChannel = (start: number, end: number): number => parseInt(fullHex.substring(start, end), 16);

  const r = parseChannel(0, 2);
  const g = parseChannel(2, 4);
  const b = parseChannel(4, 6);

  // 处理透明度
  const numericAlpha = Number(alpha);
  if (isNaN(numericAlpha)) {
    throw new Error('Alpha must be a valid number');
  }
  if (numericAlpha < 0 || numericAlpha > 1) {
    throw new Error('Alpha must be between 0 and 1');
  }

  // 标准化输出格式
  const formattedAlpha = numericAlpha % 1 === 0 ? numericAlpha.toFixed(0) : numericAlpha.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');

  return `rgba(${r}, ${g}, ${b}, ${formattedAlpha})`;
}
