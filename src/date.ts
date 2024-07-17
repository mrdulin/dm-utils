import { i18n } from './i18n';

/**
 * Generates an array of numbers representing a range of years between the start year and the end year.
 *
 * @param {number} start - the starting year of the range
 * @param {number} end - the ending year of the range (defaults to the current year)
 * @return {number[]} an array of numbers representing the range of years
 */
export function rangeOfYears(start: number, end: number = new Date().getFullYear()): number[] {
  return Array(end - start + 1)
    .fill(start)
    .map((year, index) => year + index);
}

export enum YearOptionKind {
  Numbers,
  Objects,
}

export interface YearOption {
  label: string;
  value: number;
}

export type GetYearsOptions = {
  // 开始年份
  startYear?: number;
  // 最近几年
  recentYears?: number;
  // 截止年份
  endYear?: number;
  // 后缀，默认为'年'
  suffix?: string;
};
/**
 * 获取n年, 从大到小
 * @param options
 */
//TODO: TS限制只有当type参数是YearOptionKind.Objects时，才支持传suffix参数
export function getYears(options: GetYearsOptions & { type: YearOptionKind.Numbers }): number[];
export function getYears(options: GetYearsOptions & { type: YearOptionKind.Objects }): YearOption[];
export function getYears(options: GetYearsOptions & { type: YearOptionKind }): number[] | YearOption[] {
  const { recentYears = 0, startYear, endYear, suffix = '年', type } = options;
  const endY = endYear ? endYear : new Date().getFullYear();
  let ranges = recentYears;
  if (typeof startYear === 'number') {
    // 包含startYear
    ranges = endY - startYear + 1;
    if (ranges <= 0) {
      if (process.env.NODE_ENV === 'development') {
        if (endYear === undefined) {
          console.error('startYear不能大于当前年份');
        } else if (typeof endYear === 'number') {
          console.error('endYear不能小于startYear');
        }
      }
      return [];
    }
  }

  if (type === YearOptionKind.Numbers) {
    const result: number[] = [];
    for (let i = 0; i < ranges; i++) {
      result.push(endY - i);
    }
    return result;
  }

  if (type === YearOptionKind.Objects) {
    const result: YearOption[] = [];
    for (let i = 0; i < ranges; i++) {
      result.push({
        value: endY - i,
        label: `${endY - i}${suffix}`,
      });
    }
    return result;
  }

  throw new Error('type must be enum: YearOptionKind.Numbers or YearOptionKind.Objects');
}

export const dayOfWeek = (num: number, lang: keyof typeof i18n = 'zh'): string => {
  if (!Number.isInteger(num)) {
    throw new Error('请输入一个整数');
  }
  return i18n[lang].dayOfWeek[num % 7];
};
