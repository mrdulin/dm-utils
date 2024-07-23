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
