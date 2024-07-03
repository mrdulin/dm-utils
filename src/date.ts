/**
 * Generates an array of numbers representing a range of years between the start year and the end year.
 *
 * @param {number} start - the starting year of the range
 * @param {number} end - the ending year of the range (defaults to the current year)
 * @return {number[]} an array of numbers representing the range of years
 */
export const rangeOfYears = (start: number, end: number = new Date().getFullYear()): number[] =>
  Array(end - start + 1)
    .fill(start)
    .map((year, index) => year + index);

export interface RecentYearOption {
  label: string;
  value: number;
}

/**
 * 获取最近n年, 从大到小
 * @param recentYears 最近几年
 * @param type 控制返回值类型
 * @param suffix 后缀，默认为'年'
 */
export function getRecentYears(recentYears: number, type: 'number[]'): number[];
export function getRecentYears(recentYears: number, type: 'object[]'): RecentYearOption[];
export function getRecentYears(recentYears: number, type: 'number[]' | 'object[]', suffix = '年'): number[] | RecentYearOption[] {
  const thisYear = new Date().getFullYear();
  if (type === 'number[]') {
    const result: number[] = [];
    for (let i = 0; i < recentYears; i++) {
      result.push(thisYear - i);
    }
    return result;
  }

  if (type === 'object[]') {
    const result: RecentYearOption[] = [];
    for (let i = 0; i < recentYears; i++) {
      result.push({
        value: thisYear - i,
        label: `${thisYear - i}${suffix}`,
      });
    }
    return result;
  }

  throw new Error('type must be "number[]" or "object[]"');
}
