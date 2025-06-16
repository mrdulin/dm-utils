/**
 * 将十六进制颜色转换为 RGBA 颜色
 * @param hex 十六进制颜色
 * @param alpha 透明度，默认值为 1
 * @returns RGBA 颜色
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
