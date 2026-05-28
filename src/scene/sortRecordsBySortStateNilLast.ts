import { ValueOf } from '../types';
import orderBy from 'lodash.orderby';
import isNil from 'lodash.isnil';

export const VirtualTableSortDirection = {
  /** 无排序 */
  NONE: 0,
  /** 升序 */
  ASC: 1,
  /** 降序 */
  DESC: -1,
} as const;

export interface VirtualTableSort {
  /** 排序字段 */
  field: string;
  /** 排序方向 */
  direction: ValueOf<typeof VirtualTableSortDirection>;
}

type SortRecordsBySortStateNilLastOptions<T extends object> = {
  getSortValue?: (record: T, field: keyof T) => unknown;
};

const getDefaultSortableFieldValue = <T extends object>(record: T, field: keyof T) => {
  const value = (record as Record<PropertyKey, unknown>)[field as PropertyKey];

  if (isNil(value)) {
    return undefined;
  }

  return value;
};

/**
 * 根据排序状态对记录进行排序，并将 `null` / `undefined` 排到最后。
 *
 * @template T
 * @param records 待排序记录列表
 * @param sortState 当前排序状态
 * @param options 排序选项
 * @param options.getSortValue 自定义获取排序值的方法，默认读取记录上的同名字段
 * @returns 排序后的记录列表；当 `records` 或 `sortState` 无效时返回原值
 */
export const sortRecordsBySortStateNilLast = <T extends object>(
  records: T[] | undefined,
  sortState: VirtualTableSort | undefined,
  options?: SortRecordsBySortStateNilLastOptions<T>,
) => {
  if (sortState === undefined || sortState.direction === VirtualTableSortDirection.NONE || records === undefined) {
    return records;
  }

  const sortField = sortState.field as keyof T;
  const isAsc = sortState.direction === VirtualTableSortDirection.ASC;
  const getSortValue = options?.getSortValue ?? getDefaultSortableFieldValue;

  return orderBy(
    records,
    [(record) => (isNil(getSortValue(record, sortField)) ? 1 : 0), (record) => getSortValue(record, sortField)],
    ['asc', isAsc ? 'asc' : 'desc'],
  );
};
