import { format } from '../src/decimal';

describe('decimal', () => {
  it('should return string with 3 decimal places by default', () => {
    expect(format(1.1)).to.be.equal('1.100');
  });
  it('should return string with 2 decimal places', () => {
    expect(format(1.1, { decimalPlaces: 2 })).to.be.equal('1.10');
  });
  it('should return string with suffix', () => {
    expect(format(1.1, { suffix: '%' })).to.be.equal('1.100%');
  });
  it('should return string with prefix', () => {
    expect(format(1.1, { prefix: '+' })).to.be.equal('+1.100');
  });
  it('should return fallback value if value is not a number', () => {
    expect(format(undefined)).to.be.equal('--');
    expect(format(null)).to.be.equal('--');
    expect(format(NaN)).to.be.equal('--');
    expect(format('abc')).to.be.equal('--');
    expect(format('')).to.be.equal('--');
  });

  it('should return string with operation result', () => {
    expect(format(0.012, { decimalPlaces: 2, suffix: '%', operation: [{ operator: 'mul', value: 100 }] })).to.be.equal('1.20%');
  });

  it('should return string with operation result', () => {
    expect(format(1.23456789, { decimalPlaces: false })).to.be.equal('1.23456789');
  });
});
