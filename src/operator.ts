/**
 * 检查数据类型
 * @param obj
 * @returns
 */
export const trueTypeOf = (obj: unknown): string => Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
