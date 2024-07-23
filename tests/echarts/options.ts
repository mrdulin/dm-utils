import {
  AxisPointerComponentOption,
  ContinousVisualMapComponentOption,
  EChartsOption,
  GridComponentOption,
  InsideDataZoomComponentOption,
  LegendComponentOption,
  PiecewiseVisualMapComponentOption,
  SliderDataZoomComponentOption,
  TooltipComponentOption,
  XAXisComponentOption,
  YAXisComponentOption,
} from 'echarts';

export function getInitialOption(): EChartsOption {
  return {
    legend: getInitialLegend(),
    grid: getInitialGrid(),
    xAxis: [getInitialXAxis()],
    yAxis: [getInitialYAxis()],
    dataZoom: [getInitialDataZoomSlider(), getInitialDataZoomInside()],
    tooltip: getInitialTooltip(),
    axisPointer: getInitialAxisPointer(),
    series: [],
  };
}

/**
 * 获取白色背景的echart配置项
 * @returns 白色背景的echart配置项
 */
export function getInitialwhiteBackgroundOption(): EChartsOption {
  return {
    legend: {
      right: 50,
      itemGap: 20,
      itemWidth: 10,
      itemHeight: 10,
      icon: 'circle',
      textStyle: {
        color: '#40516B',
      },
    },
    grid: {
      right: 50,
      left: 50,
    },
    xAxis: [getInitialXAxis()],
    yAxis: [getInitialYAxis()],
    dataZoom: [getInitialDataZoomSlider()],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        lineStyle: {
          color: '#B8CAE6',
        },
        crossStyle: {
          color: '#B8CAE6',
        },
      },
      position: getTooltipPosition,
      backgroundColor: '#40516B',
      padding: 5,
    },
    series: [],
  };
}

export function getInitialLegend(): LegendComponentOption {
  return {
    right: 20,
    itemGap: 20,
    itemWidth: 10,
    itemHeight: 10,
    icon: 'circle',
    textStyle: {
      color: '#B8CAE6',
      lineHeight: 14,
    },
    inactiveColor: '#667080',
    pageIcons: {
      horizontal: [
        'M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 0 0 0 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z',
        'M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z',
      ],
    },
    pageIconColor: '#8aaee6',
    pageIconInactiveColor: '#4d6180',
    pageIconSize: 12,
    pageTextStyle: {
      color: '#BEBEBE',
    },
  };
}

export function getInitialGrid(): GridComponentOption {
  return {
    right: 50,
    left: 50,
  };
}

export function getInitialXAxis(): XAXisComponentOption {
  return {
    name: '',
    scale: true,
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
    },
    splitLine: {
      lineStyle: {
        color: '#37465C',
      },
    },
    axisPointer: {
      label: {
        shadowColor: 'transparent',
      },
    },
  };
}

/**
 * 获取白色背景的echart X 轴的配置
 * @returns 白色背景的echart X 轴的配置
 */
export function getInitialwhiteBackgroundXAxis(): XAXisComponentOption {
  return {
    name: 'xAxis',
    scale: true,
    nameTextStyle: {
      color: '#40516B',
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
      color: '#40516B',
    },
    splitLine: {
      lineStyle: {
        color: '#37465C',
      },
    },
    axisPointer: {
      label: {
        shadowColor: 'transparent',
      },
    },
  };
}

export function getInitialYAxis(): YAXisComponentOption {
  return {
    name: '',
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
    },
    splitLine: {
      lineStyle: {
        color: '#37465C',
      },
    },
    axisPointer: {
      label: {
        shadowColor: 'transparent',
      },
    },
  };
}

/**
 * 获取白色背景的echart Y 轴的配置
 * @returns 白色背景的echart Y 轴的配置
 */
export function getInitialwhiteBackgroundYAxis(): YAXisComponentOption {
  return {
    name: 'yAxis',
    scale: true,
    nameTextStyle: {
      color: '#40516B',
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
      color: '#40516B',
    },
    splitLine: {
      lineStyle: {
        color: '#D8E0EB',
      },
    },
    axisPointer: {
      label: {
        shadowColor: 'transparent',
        backgroundColor: '#4D6180',
      },
    },
  };
}

export function getInitialDataZoomInside(): InsideDataZoomComponentOption {
  return {
    type: 'inside',
    minValueSpan: 2,
  };
}

export function getInitialDataZoomSlider(): SliderDataZoomComponentOption {
  return {
    type: 'slider',
    showDetail: false,
    backgroundColor: '#37465C',
    fillerColor: 'rgba(104,132,173,0.4)',
    borderColor: 'none',
    textStyle: {
      color: '#B8CAE6',
    },
    minValueSpan: 2,
    height: 16,
    bottom: 10,
  };
}

export function getInitialVisualMapContinuous(): ContinousVisualMapComponentOption {
  return {
    type: 'continuous',
    textStyle: {
      color: '#fff',
    },
    backgroundColor: '#3D414D',
  };
}

export function getInitialVisualMapPiecewise(): PiecewiseVisualMapComponentOption {
  return {
    type: 'piecewise',
    textStyle: {
      color: '#fff',
    },
    backgroundColor: '#3D414D',
  };
}

export function getInitialTooltip(): TooltipComponentOption {
  return {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      lineStyle: {
        color: '#B8CAE6',
        opacity: 0.6,
      },
      crossStyle: {
        color: '#B8CAE6',
        opacity: 0.6,
      },
    },
    position: getTooltipPosition,
    backgroundColor: '#40516B',
    borderWidth: 0,
    padding: 5,
    textStyle: {
      color: '#fff',
    },
  };
}

export function getInitialAxisPointer(): AxisPointerComponentOption {
  return {};
}

export function getTooltipPosition(point: any, params: any, dom: any, rect: any, size: any) {
  const offsetX = 20;
  const offsetY = 20;
  // 其中point为当前鼠标的位置，size中有两个属性：viewSize和contentSize，分别为外层div和tooltip提示框的大小
  const x = point[0];
  const y = point[1];
  const viewWidth = size.viewSize[0];
  const viewHeight = size.viewSize[1];
  const boxWidth = size.contentSize[0];
  const boxHeight = size.contentSize[1];
  let posX = 0; // x坐标位置
  let posY = 0; // y坐标位置

  posX = x + offsetX;
  posY = y + offsetY;

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
}
