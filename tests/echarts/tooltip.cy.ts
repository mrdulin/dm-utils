import { TooltipComponentPositionCallback } from 'echarts/types/dist/echarts';
import { confinePosition } from '../../src/echarts/tooltip';

type TooltipPositionParams = Parameters<TooltipComponentPositionCallback>;

const getPosition = (point: TooltipPositionParams[0], size: TooltipPositionParams[4]) => {
  return confinePosition(point, {} as TooltipPositionParams[1], null, null, size);
};

describe('confinePosition', () => {
  it('should position the tooltip to the lower right of the pointer', () => {
    expect(
      getPosition([100, 50], {
        contentSize: [50, 40],
        viewSize: [300, 200],
      }),
    ).to.deep.equal([120, 70]);
  });

  it('should position the tooltip to the upper left when it overflows the lower right edge', () => {
    expect(
      getPosition([290, 190], {
        contentSize: [50, 40],
        viewSize: [300, 200],
      }),
    ).to.deep.equal([220, 130]);
  });

  it('should limit the tooltip position to the view origin', () => {
    expect(
      getPosition([10, 10], {
        contentSize: [100, 100],
        viewSize: [100, 100],
      }),
    ).to.deep.equal([0, 0]);
  });
});
