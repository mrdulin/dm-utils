// 二分

/**
 * 二分查找target 在arr中的索引
 * @param arr
 * @param target
 * @param forward true 向前取值，false
 * @param backward true 向后取值，false
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
