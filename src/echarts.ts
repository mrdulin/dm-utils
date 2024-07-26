import dayjs from 'dayjs';
import deepmerge, { ArrayMergeOptions } from 'deepmerge';
import { EChartsOption } from 'echarts';
import { trueTypeOf } from './operator';

const combineMerge = (target: any[], source: any[], options: ArrayMergeOptions) => {
  const destination = target.slice();

  source.forEach((item, index) => {
    if (typeof destination[index] === 'undefined') {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options);
    } else if (options.isMergeableObject(item)) {
      destination[index] = deepmerge(target[index], item, options);
    } else if (target.indexOf(item) === -1) {
      destination.push(item);
    }
  });
  return destination;
};

export function mergeOption(defaults: EChartsOption, overrides: EChartsOption, option?: deepmerge.Options) {
  return deepmerge<EChartsOption>(defaults, overrides, { arrayMerge: combineMerge, ...option });
}

/**
 * 场景：后端接口返回某几个时间的点的数据，需求是在接口数据的基础上每隔5分钟补一个点，以达到图中的效果
 * https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/Dingtalk_20240724140535.jpg
 * 每5分钟补一个点, Y轴值为前一个点的值
 * 时间示例: [9:23, 9:27] => [9:23, 9:25, 9:27, 9:30]
 *
 * 填充的点只包含x,y轴字段，入参数据保持不变
 */

// TODO improve TS types
export function fill<T extends Record<string, any>, XAxisField extends keyof T, YAxisField extends keyof T>(
  dataSource: T[],
  xAxisField: XAxisField,
  yAxisField: YAxisField,
) {
  const data = [];
  for (let i = 0; i < dataSource.length; i++) {
    const current = dataSource[i];
    const next = dataSource[i + 1];
    data.push({ ...current, [xAxisField]: dayjs(current[xAxisField]).valueOf(), [yAxisField]: current[yAxisField] });
    if (next !== null && next !== undefined) {
      let currentDate = dayjs(current[xAxisField]);
      const nextDate = dayjs(next[xAxisField]);
      const timeDiff = dayjs(next[xAxisField]).diff(dayjs(current[xAxisField]), 'minute');
      let count = Math.ceil(timeDiff / 5);
      const remainder = currentDate.minute() % 5;
      if (remainder > 0 && nextDate.minute() % 5 !== 0) {
        currentDate = dayjs(current[xAxisField]).add(5 - remainder, 'minute');
        data.push({ [xAxisField]: currentDate.valueOf(), [yAxisField]: current[yAxisField] });
      }
      for (let j = 1; j < count; j++) {
        data.push({
          [xAxisField]: currentDate
            .clone()
            .add(5 * j, 'minute')
            .valueOf(),
          [yAxisField]: current[yAxisField],
        });
      }
    }
  }
  return data;
}

/**
 * 最大差值倍率计算；基础倍率1.2，Y轴刻度精度为0.01，并且Y轴刻度需要被5等分（即max - min需要被5等分），否则会出现重复的刻度；
 * 判断max-min是否被5等分(是否小于0.01)，小于0.01表示不能被5等分，基础倍率增加0.1后，再次判断，直到被5等分
 * @param first
 * @param maxDiff
 * @param decimalPlaces
 * @param splitNumber
 * @returns 最大差值倍率
 */
export const getDiffRate = (first: number, maxDiff: number, decimalPlaces = 2, splitNumber = 5): number => {
  let diffRate = 1.2;
  if (first === 0 || maxDiff === 0) return diffRate;
  const minDiff = 1 / Math.pow(10, decimalPlaces);

  function calc(f: number, d: number): number {
    const max = f + d * diffRate;
    const min = f - d * diffRate;
    if ((max - min) / splitNumber < minDiff) {
      diffRate += 0.1;
      return calc(f, d);
    }
    return diffRate;
  }

  return calc(first, maxDiff);
};

/**
 * 计算echarts YAxis的max和min属性，以达到根据实际数据动态调整，使折线图的波动明显。且第一个点始终在Y轴中间位置
 * @param data 原始数据
 * @param key Y轴字段
 * @param decimalPlaces Y轴值的精度(小数位数)
 * @param splitNumber Y轴splitNumber属性
 * @returns
 */
export function calcYAxisRange<T extends Record<string, any>, Key extends keyof T>(
  data: T[],
  key: Key,
  decimalPlaces = 2,
  splitNumber = 5,
) {
  const maxValue = Math.max(...data.map((o) => o[key])) ?? 0;
  const minValue = Math.min(...data.map((o) => o[key])) ?? 0;
  let firstValue = 0;
  for (const item of data) {
    if (trueTypeOf(item[key]) === 'number') {
      firstValue = item[key];
      break;
    }
  }

  // 最大值与第一个点的差值，最小值与第一个点的差值，取最大
  // 例如：first = 1, max = 1.3, min = 0.6, maxDiff = abs(min - first) = 0.4
  const maxDiff = Math.max(Math.abs(maxValue - firstValue), Math.abs(minValue - firstValue));
  // 差值缩放比例
  const diffRate = getDiffRate(firstValue, maxDiff, decimalPlaces, splitNumber);

  const max = firstValue + (maxDiff === 0 ? firstValue / 6 : maxDiff * diffRate);
  const min = firstValue - (maxDiff === 0 ? firstValue / 6 : maxDiff * diffRate);

  return { max, min };
}
