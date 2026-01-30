/**
 * 二分查找 target 在 arr 中的索引
 * 如果找不到精确匹配，可以根据 forward 或 backward 参数返回最接近的索引
 *
 * @template T - 数组元素的类型
 * @param arr - 已排序的数组
 * @param target - 要查找的目标值
 * @param forward - 是否向前取值，当找不到精确匹配时，返回小于目标值的最大索引，默认为 false
 * @param backward - 是否向后取值，当找不到精确匹配时，返回大于目标值的最小索引，默认为 false
 * @returns 返回目标值的索引，如果找不到且未设置 forward/backward 则返回 -1
 *
 * @example
 * ```typescript
 * // 精确查找
 * const arr = [1, 3, 5, 7, 9];
 * binarySearchIndex(arr, 5); // 返回 2
 *
 * // 向前取值
 * binarySearchIndex(arr, 6, true); // 返回 2（5 的索引）
 *
 * // 向后取值
 * binarySearchIndex(arr, 6, false, true); // 返回 3（7 的索引）
 * ```
 */
export const binarySearchIndex = <T>(arr: T[], target: T, forward = false, backward = false): number => {
  let low = 0;
  let high = arr.length - 1;
  let result = -1; // 如果找不到，返回-1

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) {
      return mid; // 找到目标值，返回索引
    } else if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
    if (forward) {
      // 向前取值
      if (arr[mid] < target) {
        result = mid;
      }
    } else if (backward) {
      // 向后取值
      if (arr[mid] > target) {
        result = mid;
      }
    }
  }
  return result;
};
