import { calcYAxisRange, getDiffRate } from '../../src/echarts';

describe('calcYAxisRange', () => {
  describe('getDiffRate', () => {
    it('should return the correct diff rate', () => {
      // 第一次递归
      // max = 1.034, min = 0.986, (max - min)/splitNumber = (1.034-0.986)/5 = 0.009600000000000008
      // diffRate + 0.1 = 1.3
      expect(getDiffRate(1.01, 0.02)).to.be.equal(1.3);
    });

    it('should return default diff rate if first value is 0', () => {
      expect(getDiffRate(0, 0.02)).to.be.equal(1.2);
    });
  });
  it.only('should return the correct y axis range for data with decimal places 2', () => {
    const data = [{ price: 1.01 }, { price: 1.02 }, { price: 1.02 }, { price: 1 }, { price: 0.99 }];
    const { max, min } = calcYAxisRange(data, 'price');
    expect(max.toFixed(2)).to.be.equal('1.04');
    expect(min.toFixed(2)).to.be.equal('0.98');
  });

  it('should return the correct y axis range for data with decimal places 1', () => {
    const data = [{ price: 1.1 }, { price: 1.08 }, { price: 1.1 }, { price: 1.09 }, { price: 1.09 }, { price: 1.12 }, { price: 1.09 }];
    const decimalPlaces = 2;
    const { max, min } = calcYAxisRange(data, 'price', decimalPlaces);
    expect(max.toFixed(decimalPlaces)).to.be.equal('1.13');
    expect(min.toFixed(decimalPlaces)).to.be.equal('1.07');
  });
});
