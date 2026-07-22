import { TooltipComponentPositionCallback } from 'echarts/types/dist/echarts';

/**
 * 根据鼠标位置和 tooltip 尺寸尝试调整提示框位置。
 *
 * 默认将提示框放在鼠标位置右下方各 20 像素处；当提示框会超出右侧或底部边界时，
 * 分别移动到鼠标左侧或上方。若移动后仍会越界，则将对应坐标限制为 0。
 * ECharts 后续仍可能应用 `tooltip.align` 或 `tooltip.verticalAlign` 调整最终位置。
 *
 * @param point 当前鼠标在图表视图中的像素坐标，格式为 `[x, y]`。
 * @param _params 当前触发 tooltip 的数据项。
 * @param _dom ECharts 创建的 tooltip DOM 元素。
 * @param _rect 当前触发元素的布局矩形。
 * @param size tooltip 内容与图表视图的尺寸信息。
 * @returns tooltip 左上角坐标，格式为 `[left, top]`。
 * @example
 * const option = {
 *   tooltip: {
 *     confine: true,
 *   },
 * };
 *
 * @deprecated 优先使用 ECharts 的 `tooltip.confine: true` 配置替代。
 */
export const confinePosition: TooltipComponentPositionCallback = (point, _params, _dom, _rect, size) => {
  const offsetX = 20;
  const offsetY = 20;
  const [x, y] = point;
  const [viewWidth, viewHeight] = size.viewSize;
  const [boxWidth, boxHeight] = size.contentSize;
  let posX = x + offsetX;
  let posY = y + offsetY;

  if (posX + boxWidth > viewWidth) {
    posX = x - boxWidth - offsetX;
  }

  if (posX < 0) {
    posX = 0;
  }

  if (posY + boxHeight > viewHeight) {
    posY = y - boxHeight - offsetY;
  }

  if (posY < 0) {
    posY = 0;
  }

  return [posX, posY];
};
