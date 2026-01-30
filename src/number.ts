/**
 * 生成指定范围内的随机整数
 *
 * 该函数使用 Math.random() 生成一个介于 min 和 max（包含边界值）之间的随机整数。
 * 算法通过将随机浮点数乘以范围大小并向下取整来实现均匀分布。
 *
 * @param {number} min - 随机数的最小值（包含），必须小于等于 max
 * @param {number} max - 随机数的最大值（包含），必须大于等于 min
 * @returns {number} 返回一个在 [min, max] 范围内的随机整数
 * @throws {Error} 当 min 大于 max 时可能抛出错误（取决于具体实现）
 * @since 1.0.0
 * @category Number Operations
 * @example
 * // 生成 1 到 10 之间的随机整数
 * const randomNum = randomInt(1, 10);
 * console.log(randomNum); // 可能输出 1 到 10 之间的任意整数
 *
 * @example
 * // 生成 0 到 1 之间的随机整数（常用于布尔值随机选择）
 * const boolValue = randomInt(0, 1);
 *
 * @example
 * // 生成负数范围内的随机整数
 * const negativeRandom = randomInt(-5, -1);
 * console.log(negativeRandom); // 可能输出 -5 到 -1 之间的任意整数
 */
export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
