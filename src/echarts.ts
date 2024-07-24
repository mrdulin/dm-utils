import dayjs from 'dayjs';
import deepmerge, { ArrayMergeOptions } from 'deepmerge';
import { EChartsOption } from 'echarts';

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
 * 场景：后端接口返回某几个时间的点的树，需求是在接口数据的基础上每隔5分钟补一个点，以达到图中的效果
 * https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/Dingtalk_20240724140535.jpg
 * 每5分钟补一个点, Y轴值为前一个点的值
 * 时间示例: [9:23, 9:27] => [9:23, 9:25, 9:27, 9:30]
 */
export const fill = <T extends Record<string, any>, XAxisField extends keyof T, YAxisField extends keyof T>(
  dataSource: T[],
  xAxisField: XAxisField,
  yAxisField: YAxisField,
) => {
  const data = [];
  for (let i = 0; i < dataSource.length; i++) {
    const current = dataSource[i];
    const next = dataSource[i + 1];
    data.push({ ...current, [xAxisField]: dayjs(current[xAxisField]).valueOf(), [yAxisField]: current[yAxisField] });
    if (next !== null && next !== undefined) {
      const timeDiff = dayjs(next[xAxisField]).diff(dayjs(current[xAxisField]), 'minute');
      let count = Math.ceil(timeDiff / 5);
      let startDate = dayjs(current[xAxisField]);
      const nextDate = dayjs(next[xAxisField]);
      const remainder = startDate.minute() % 5;
      if (remainder > 0 && nextDate.minute() % 5 !== 0) {
        startDate = dayjs(current[xAxisField]).add(5 - remainder, 'minute');
        data.push({ [xAxisField]: startDate.valueOf(), [yAxisField]: current[yAxisField] });
      }
      for (let j = 1; j < count; j++) {
        data.push({
          [xAxisField]: startDate
            .clone()
            .add(5 * j, 'minute')
            .valueOf(),
          [yAxisField]: current[yAxisField],
        });
      }
    }
  }
  return data;
};
