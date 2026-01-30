import isEqual from 'react-fast-compare';

export const ZeroValues = [undefined, null, '', NaN, [], {}];

/**
 * 从对象中移除包含零值的键值对
 *
 * 此函数会遍历输入对象的所有属性，比较每个值是否与零值数组中的任一值相等，
 * 如果相等则在结果对象中忽略该键值对。使用 react-fast-compare 库进行深度相等比较，
 * 可以正确处理复杂数据结构的比较。
 *
 * @template T 扩展自 Record<string, any> 的对象类型
 * @param {T} obj - 要处理的源对象，必须是一个键值对集合
 * @param {any[]} [zeroValues=[undefined, null, '', NaN, [], {}]] - 零值数组，默认包含 undefined、null、空字符串、NaN、空数组和空对象
 * @returns {T} 返回移除了零值键的新对象，保持原始对象的类型结构，但移除了零值属性
 * @throws {Error} 当 zeroValues 参数不是数组时抛出错误，确保函数调用的安全性
 * @since 1.0.0
 * @category Object Manipulation
 * @example
 * // 使用默认零值
 * const obj = { a: 1, b: null, c: '', d: 0, e: [] };
 * const result = removeZeroValueKeys(obj);
 * console.log(result); // { a: 1, d: 0 }
 *
 * @example
 * // 使用自定义零值
 * const obj = { a: 1, b: 'test', c: 'ignore' };
 * const result = removeZeroValueKeys(obj, ['ignore']);
 * console.log(result); // { a: 1, b: 'test' }
 *
 * @example
 * // 处理嵌套对象（使用深度比较）
 * const obj = { a: 1, b: { x: 1 }, c: {} };
 * const result = removeZeroValueKeys(obj);
 * console.log(result); // { a: 1, b: { x: 1 } }
 */
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
 * 获取对象键的类型安全版本
 *
 * 这是对 Object.keys() 的类型安全封装，返回联合类型而非 string[]，
 * 使 TypeScript 能够推断出确切的键名，提高类型安全性。
 *
 * 标准的 Object.keys() 总是返回 string[] 类型，而此函数返回 keyof T 类型的数组，
 * 这意味着 TypeScript 知道数组中只包含对象的实际键名。
 *
 * @template T 对象类型
 * @param {T} obj - 要获取键的对象
 * @returns {(keyof T)[]} 返回对象键的数组，类型为 keyof T 联合类型
 * @since 1.0.0
 * @example
 * const obj = { a: 1, b: '2', c: true };
 *
 * // 标准 Object.keys 返回 string[]
 * const standardKeys = Object.keys(obj); // 类型为 string[]
 *
 * // typedKeys 返回类型安全的键数组
 * const safeKeys = typedKeys(obj); // 类型为 ('a' | 'b' | 'c')[]
 *
 * // 在循环中使用时，typedKeys 提供更好的类型检查
 * safeKeys.forEach(key => {
 *   console.log(obj[key]); // TypeScript 知道 obj[key] 的确切类型
 * });
 */
export const typedKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;
