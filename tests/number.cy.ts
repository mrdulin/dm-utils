import { safeDivide, safeMinus, safeMultiply, safePlus } from '../src/number';

describe('number', () => {
  describe('safeMinus', () => {
    it('should return the subtraction result when both operands are numbers', () => {
      expect(safeMinus(5, 2)).to.eq(3);
    });

    it('should support numeric strings', () => {
      expect(safeMinus('5', '2')).to.eq(3);
      expect(safeMinus(' 5 ', 2)).to.eq(3);
    });

    it('should return undefined when either operand is nullish', () => {
      expect(safeMinus(undefined, 2)).to.be.undefined;
      expect(safeMinus(5, null)).to.be.undefined;
    });

    it('should return undefined when either operand is an invalid string', () => {
      expect(safeMinus('abc', 2)).to.be.undefined;
      expect(safeMinus('', '2')).to.be.undefined;
      expect(safeMinus('   ', 2)).to.be.undefined;
    });
  });

  describe('safePlus', () => {
    it('should return the addition result when both operands are numbers', () => {
      expect(safePlus(5, 2)).to.eq(7);
    });

    it('should support numeric strings', () => {
      expect(safePlus('5', '2')).to.eq(7);
      expect(safePlus(' 5 ', 2)).to.eq(7);
    });

    it('should return undefined when either operand is nullish', () => {
      expect(safePlus(null, 2)).to.be.undefined;
      expect(safePlus(5, undefined)).to.be.undefined;
    });

    it('should return undefined when either operand is an invalid string', () => {
      expect(safePlus('abc', 2)).to.be.undefined;
      expect(safePlus('', '2')).to.be.undefined;
      expect(safePlus('   ', 2)).to.be.undefined;
    });
  });

  describe('safeMultiply', () => {
    it('should return the multiplication result when both operands are numbers', () => {
      expect(safeMultiply(5, 2)).to.eq(10);
    });

    it('should support numeric strings', () => {
      expect(safeMultiply('5', '2')).to.eq(10);
      expect(safeMultiply(' 5 ', 2)).to.eq(10);
    });

    it('should return undefined when either operand is nullish', () => {
      expect(safeMultiply(undefined, 2)).to.be.undefined;
      expect(safeMultiply(5, null)).to.be.undefined;
    });

    it('should return undefined when either operand is an invalid string', () => {
      expect(safeMultiply('abc', 2)).to.be.undefined;
      expect(safeMultiply('', '2')).to.be.undefined;
      expect(safeMultiply('   ', 2)).to.be.undefined;
    });
  });

  describe('safeDivide', () => {
    it('should return the division result when both operands are numbers', () => {
      expect(safeDivide(6, 2)).to.eq(3);
    });

    it('should support numeric strings', () => {
      expect(safeDivide('6', '2')).to.eq(3);
      expect(safeDivide(' 6 ', 2)).to.eq(3);
    });

    it('should return undefined when either operand is nullish', () => {
      expect(safeDivide(null, 2)).to.be.undefined;
      expect(safeDivide(6, undefined)).to.be.undefined;
    });

    it('should return undefined when divisor is zero', () => {
      expect(safeDivide(1, 0)).to.be.undefined;
      expect(safeDivide(1, '0')).to.be.undefined;
    });

    it('should return undefined when either operand is an invalid string', () => {
      expect(safeDivide('abc', 2)).to.be.undefined;
      expect(safeDivide('', '2')).to.be.undefined;
      expect(safeDivide('   ', 2)).to.be.undefined;
    });
  });
});
