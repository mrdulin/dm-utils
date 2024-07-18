import Decimal from 'decimal.js-light';

export type FormatOptions = {
  decimalPlaces?: number | false;
  suffix?: string;
  prefix?: string;
  defaultValue?: string;
  operation?: {
    operator: 'add' | 'sub' | 'mul' | 'div' | 'toDecimalPlaces';
    value: number;
  }[];
};
/**
 * 格式化数字，默认保留3位小数，可添加前缀，后缀，默认值为'--'
 * @param value
 * @param options
 * @returns
 */
export function format(value: number | string | undefined | null, options?: FormatOptions): string {
  const { decimalPlaces = 3, suffix = '', defaultValue = '--', prefix = '', operation } = options ?? {};

  if (value === null || value === undefined || isNaN(Number(value)) || value === '') {
    return defaultValue;
  }

  let decimalValue = new Decimal(value);

  if (Array.isArray(operation) && operation.length > 0) {
    operation.forEach((item) => {
      decimalValue = decimalValue[item.operator](item.value);
    });
  }

  if (decimalPlaces == false) {
    return prefix + decimalValue.toString() + suffix;
  }

  return prefix + decimalValue.toFixed(decimalPlaces) + suffix;
}
