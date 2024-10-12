import isEqual from 'react-fast-compare';

export const ZeroValues = [undefined, null, '', NaN, [], {}];

/**
 * 移除零值的键
 * 默认的零值是：undefined、null、空字符串, NaN, [], {}
 */
// TODO: improve TS type
export const removeZeroValueKeys = <T extends Record<string, any>>(obj: T, zeroValues = ZeroValues): T => {
  if (!Array.isArray(zeroValues)) {
    throw new Error('zeroValues must be an array');
  }

  const r = {} as T;
  for (const key in obj) {
    const value = obj[key];
    const shouldRemove = zeroValues.some((v) => isEqual(v, value));
    if (shouldRemove) continue;
    r[key] = value;
  }
  return r;
};

/**
 * 返回tuple，而不是string[]
 * const obj = { a: 1, b: '2' };
 * Object.keys(obj) => string[]
 * typedKeys({ a: 1, b: '2' }) => ('a' | 'b')[]
 */
export const typedKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;
