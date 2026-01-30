/**
 * 获取 JavaScript 值的真实类型
 *
 * 使用 Object.prototype.toString 方法获取最准确的数据类型，
 * 这比 typeof 操作符更精确，可以区分数组、日期、正则表达式等具体类型。
 *
 * @param {unknown} obj - 要检查类型的值，可以是任何 JavaScript 类型
 * @returns {string} 返回小写的类型名称，如 'array', 'date', 'regexp', 'object', 'string', 'number', 'boolean' 等
 * @since 1.0.0
 * @example
 * trueTypeOf([]); // 'array'
 * trueTypeOf({}); // 'object'
 * trueTypeOf(new Date()); // 'date'
 * trueTypeOf(/abc/); // 'regexp'
 * trueTypeOf(null); // 'null'
 * trueTypeOf(undefined); // 'undefined'
 * trueTypeOf('hello'); // 'string'
 * trueTypeOf(42); // 'number'
 * trueTypeOf(true); // 'boolean'
 */
export const trueTypeOf = (obj: unknown): string => Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
