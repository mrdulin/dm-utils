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

// 使用泛型和条件类型来实现参数的条件约束
export type GetYearsOptions<T extends YearOptionKind> = {
  // 开始年份
  startYear?: number;
  // 最近几年
  recentYears?: number;
  // 截止年份
  endYear?: number;
  type: T;
  // TS限制只有当type参数是YearOptionKind.Objects时，才支持传suffix参数
} & (T extends YearOptionKind.Objects ? { suffix?: string } : {});

/**
 * 获取n年, 从大到小
 * @param options
 */
export function getYears<T extends YearOptionKind>(
  options: GetYearsOptions<T>,
): T extends YearOptionKind.Objects ? YearOption[] : number[] {
  const { recentYears = 0, startYear, endYear, type } = options;
  // 为 suffix 设置默认值，仅在需要时使用
  const suffix = (options as any).suffix ?? '年';

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
      return type === YearOptionKind.Objects ? [] : [];
    }
  }

  if (type === YearOptionKind.Numbers) {
    const result: number[] = [];
    for (let i = 0; i < ranges; i++) {
      result.push(endY - i);
    }
    return result as T extends YearOptionKind.Objects ? YearOption[] : number[];
  }

  if (type === YearOptionKind.Objects) {
    const result: YearOption[] = [];
    for (let i = 0; i < ranges; i++) {
      result.push({
        value: endY - i,
        label: `${endY - i}${suffix}`,
      });
    }
    return result as T extends YearOptionKind.Objects ? YearOption[] : number[];
  }

  throw new Error('type must be enum: YearOptionKind.Numbers or YearOptionKind.Objects');
}

export const dayOfWeek = (num: number, lang: keyof typeof i18n = 'zh'): string => {
  if (!Number.isInteger(num)) {
    throw new Error('请输入一个整数');
  }
  return i18n[lang].dayOfWeek[num % 7];
};
