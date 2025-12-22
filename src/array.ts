/**
 * 在数组中移动元素的位置（修改原数组）
 *
 * @param array - 要操作的数组
 * @param fromIndex - 要移动元素的起始索引，支持负数（-1表示最后一个元素）
 * @param toIndex - 目标位置的索引，支持负数（-1表示最后一个位置）
 * @returns 无返回值，直接修改原数组
 */
export function moveMutable<T>(array: T[], fromIndex: number, toIndex: number): void {
  // 计算实际的起始索引，支持负数索引
  const startIndex = fromIndex < 0 ? array.length + fromIndex : fromIndex;

  // 检查起始索引是否有效
  if (startIndex >= 0 && startIndex < array.length) {
    // 计算实际的目标索引，支持负数索引
    const endIndex = toIndex < 0 ? array.length + toIndex : toIndex;

    // 执行元素移动：先删除元素，再在新位置插入
    const [item] = array.splice(fromIndex, 1);
    array.splice(endIndex, 0, item);
  }
}

/**
 * 创建一个新数组，将指定位置的元素移动到新位置，不修改原数组
 * @param array 原始数组
 * @param fromIndex 要移动元素的当前位置索引
 * @param toIndex 元素要移动到的目标位置索引
 * @returns 返回一个新的数组，其中指定元素已移动到新位置
 */
export function moveImmutable<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  // 创建原数组的浅拷贝
  const newArray = [...array];
  // 在新数组上执行移动操作
  moveMutable(newArray, fromIndex, toIndex);
  return newArray;
}

/**
 * 将数组中第一个满足条件的元素移动到数组开头
 * @param array - 要操作的数组
 * @param predicate - 判断元素是否满足条件的函数
 * @returns 新的数组，其中第一个满足条件的元素被移动到开头位置
 */
export function moveToStart<T>(array: T[], predicate: (item: T) => boolean): T[] {
  // 查找第一个满足条件的元素索引
  const index = array.findIndex(predicate);
  if (index < 0) return array;
  // 创建新数组并移动元素到开头
  const newArray = [...array];
  moveMutable(newArray, index, 0);
  return newArray;
}

/**
 * 将数组中指定索引的元素移动到指定位置
 * @param arr 原始数组
 * @param indexes 需要移动的元素索引数组
 * @param start 目标插入位置的起始索引
 * @returns 移动元素后的新数组
 */
const removeSymbol = Symbol('Placeholder for removed element');
export const moveMulti = <T extends unknown>(arr: T[], indexes: number[], start: number): T[] => {
  // 创建数组副本，用于标记需要移除的元素
  const cloned: (T | Symbol)[] = arr.slice();
  for (let i = 0; i < cloned.length; i++) {
    if (indexes.includes(i)) {
      cloned[i] = removeSymbol;
    }
  }

  // 提取需要移动的元素
  const els = arr.filter((__, i) => indexes.includes(i));

  // 在目标位置插入提取的元素，并过滤掉标记为移除的元素
  cloned.splice(start, 0, ...els);
  return cloned.filter((v): v is T => v !== removeSymbol);
};

/**
 * 获取数组或undefined
 *
 * @param array - 可选的数组参数，可以是任意类型的数组、undefined或null
 * @returns 如果传入的参数是有效的非空数组则返回该数组，否则返回undefined
 */
export const getArrayOrUndefined = <T>(array?: T[] | undefined | null): T[] | undefined => {
  // 检查参数是否为数组且长度大于0，如果是则返回原数组，否则返回undefined
  if (Array.isArray(array) && array.length > 0) return array;
  return undefined;
};

/**
 * 通用序号计算工具：从指定列表中提取「前缀+数字」格式的值，找到未被使用的最小正整数序号
 * @param list 待检索的列表
 * @param options 配置项（通用化核心）
 * @param options.fieldName 要提取的字段名（比如 'groupName'）
 * @param options.prefix 匹配的前缀（比如 '组合'）
 * @param options.defaultNo 无可用序号时的默认值（默认1）
 * @returns 未被使用的最小正整数序号
 */
export function calcUnusedMinSerialNumber(list: any[], options: { fieldName: string; prefix: string; defaultNo?: number }): number {
  const { fieldName, prefix, defaultNo = 1 } = options;
  if (!list?.length) return defaultNo;

  // 获取所有匹配前缀的项目并提取序号
  const serialNumbers = list
    .map((item) => item[fieldName])
    .filter((value) => typeof value === 'string' && value.startsWith(prefix))
    .map((value) => {
      const numPart = value.substring(prefix.length);
      // 如果前缀后没有数字，则认为是序号1（或者根据业务需求处理）
      if (numPart === '') return 1;
      const num = parseInt(numPart, 10);
      return isNaN(num) ? 0 : num;
    })
    .filter((num) => num > 0)
    .sort((a, b) => a - b);

  // 如果没有匹配项，返回默认值
  if (serialNumbers.length === 0) return defaultNo;

  // 找到第一个缺失的正整数
  for (let i = 0; i < serialNumbers.length; i++) {
    if (serialNumbers[i] !== i + 1) {
      return i + 1;
    }
  }

  // 如果序列完整，返回下一个数字
  return serialNumbers.length + 1;
}
