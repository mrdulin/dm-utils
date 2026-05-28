import isEqual from 'react-fast-compare';

/**
 * 切换多选值，并在取消最后一个普通项时回退到默认值。
 *
 * @template T
 * @param params 切换参数
 * @param params.selectedValues 当前已选值
 * @param params.toggledValue 本次被切换的值
 * @param params.selected 当前值切换后的选中状态
 * @param params.defaultValue 默认值
 * @param params.isDefaultSelected 判断当前选中值是否处于默认态
 * @returns 切换后的选中值列表
 */
export const toggleSelectionValue = <T extends string | number>({
  selectedValues,
  toggledValue,
  selected,
  defaultValue,
  isDefaultSelected,
}: {
  selectedValues: T[] | undefined;
  toggledValue: T;
  selected: boolean;
  defaultValue: T;
  isDefaultSelected: (value: T[] | undefined) => boolean;
}) => {
  const normalizedSelectedValues = selectedValues ?? [];

  if (toggledValue === defaultValue) {
    return isDefaultSelected(normalizedSelectedValues) ? normalizedSelectedValues : [defaultValue];
  }

  if (selected) {
    if (isDefaultSelected(normalizedSelectedValues)) {
      return [toggledValue];
    }

    return normalizedSelectedValues.includes(toggledValue) ? normalizedSelectedValues : [...normalizedSelectedValues, toggledValue];
  }

  if (!normalizedSelectedValues.includes(toggledValue)) {
    return normalizedSelectedValues;
  }

  const nextSelectedValues = normalizedSelectedValues.filter((item) => item !== toggledValue);
  return nextSelectedValues.length > 0 ? nextSelectedValues : [defaultValue];
};

/**
 * 判断切换前后的选中值是否一致。
 *
 * @template T
 * @param selectedValues 当前选中值
 * @param nextSelectedValues 下一个选中值
 * @returns 两次选中值是否一致
 */
export const hasSameSelectionValues = <T extends string | number>(selectedValues: T[] | undefined, nextSelectedValues: T[]) =>
  isEqual(selectedValues ?? [], nextSelectedValues);
