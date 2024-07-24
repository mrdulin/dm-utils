import { graphic } from 'echarts';
import { mergeOption } from '../../src/echarts';
import { getInitialXAxis, getInitialYAxis } from './options';

describe('mergeOption', () => {
  it('should deep merge xAxis option', () => {
    const interval = (index: number) => {
      return index === 0;
    };
    const option = mergeOption(
      { xAxis: [getInitialXAxis()] },
      {
        xAxis: [
          {
            type: 'category',
            axisLabel: {
              color: '#B8CAE6',
              interval,
            },
            boundaryGap: false,
            splitLine: {
              show: true,
            },
            data: [1, 2, 3, 4],
          },
        ],
      },
    );

    expect(option.xAxis).to.deep.equal([
      {
        type: 'category',
        name: '',
        scale: true,
        boundaryGap: false,
        nameTextStyle: {
          color: '#B8CAE6',
        },
        axisLine: {
          lineStyle: {
            color: '#40516B',
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#B8CAE6',
          interval,
        },
        splitLine: {
          lineStyle: {
            color: '#37465C',
          },
          show: true,
        },
        axisPointer: {
          label: {
            shadowColor: 'transparent',
          },
        },
        data: [1, 2, 3, 4],
      },
    ]);
  });

  it('should deep merge yAxis option', () => {
    const axisLabelFormatter = (v: number) => v.toFixed(2);
    expect(
      mergeOption(
        { yAxis: [getInitialYAxis()] },
        {
          yAxis: [
            {
              name: '%',
              axisLabel: {
                formatter: axisLabelFormatter,
              },
              axisPointer: {
                label: {
                  precision: 2,
                },
              },
              min: 5,
              max: 10,
              interval: 1,
              splitNumber: 5,
            },
          ],
        },
      ),
    ).to.deep.equal({
      yAxis: [
        {
          name: '%',
          scale: true,
          nameTextStyle: {
            color: '#B8CAE6',
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#40516B',
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#B8CAE6',
            formatter: axisLabelFormatter,
          },
          splitLine: {
            lineStyle: {
              color: '#37465C',
            },
          },
          axisPointer: {
            label: {
              shadowColor: 'transparent',
              precision: 2,
            },
          },
          min: 5,
          max: 10,
          interval: 1,
          splitNumber: 5,
        },
      ],
    });
  });

  it('should deep merge series', () => {
    const areaStyleColor = new graphic.LinearGradient(0, 0, 0, 1, [
      {
        offset: 0,
        color: '#4D97FF',
      },
      {
        offset: 1,
        color: 'rgba(77,151,255,0)',
      },
    ]);

    expect(
      mergeOption(
        { series: [] },
        {
          series: [
            {
              type: 'line',
              data: [1, 2, 3, 4],
              itemStyle: {
                color: '#4D97FF',
              },
              lineStyle: {
                color: '#4D97FF',
              },
              areaStyle: {
                color: areaStyleColor,
                origin: 'start',
                opacity: 0.2,
              },
              symbolSize: 6,
              animation: false,
              connectNulls: true,
            },
          ],
        },
      ),
    ).to.containSubset({
      series: [
        {
          type: 'line',
          data: [1, 2, 3, 4],
          itemStyle: {
            color: '#4D97FF',
          },
          lineStyle: {
            color: '#4D97FF',
          },
          areaStyle: {
            color: areaStyleColor,
            origin: 'start',
            opacity: 0.2,
          },
          symbolSize: 6,
          animation: false,
          connectNulls: true,
        },
      ],
    });
  });
});
