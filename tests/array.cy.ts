import {
  calcUnusedMinSerialNumber,
  getArrayOrUndefined,
  moveMulti,
  moveToStart,
  percentRankOfSorted,
  standardDeviation,
} from '../src/array';

describe('array', () => {
  describe('moveToStart', () => {
    it('should move element to start for simple array', () => {
      const array = [1, 2, 3, 4, 5];
      const newArray = moveToStart(array, (item) => item === 4);
      expect(newArray).to.deep.equal([4, 1, 2, 3, 5]);
    });

    it('should move element to start for complex array', () => {
      const array = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
      const newArray = moveToStart(array, (item) => item.id === 4);
      expect(newArray).to.deep.equal([{ id: 4 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 5 }]);
    });

    it('should not move any element the target element is not found', () => {
      const array = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
      const newArray = moveToStart(array, (item) => item.id === 5);
      expect(newArray).to.deep.equal([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
    });
  });

  describe('moveMulti', () => {
    it('should move elements correctly', () => {
      const a = [1, 2, 3, 4, 5];
      expect(moveMulti(a, [1, 2], 4)).to.deep.equal([1, 4, 2, 3, 5]);
      expect(moveMulti(a, [2, 4], 1)).to.deep.equal([1, 3, 5, 2, 4]);
    });

    it('should move elements correctly if there are duplicate elements in the array', () => {
      const a = [1, 2, 2, 3, 2];
      const result = moveMulti(a, [1, 2], 4);
      expect(result).to.deep.equal([1, 3, 2, 2, 2]);
    });

    it('should move elements correctly if there are undefined elements in the array', () => {
      const a = [1, undefined, 2, 3, 2];
      const result = moveMulti(a, [1, 2], 4);
      expect(result).to.deep.equal([1, 3, undefined, 2, 2]);
    });
  });

  describe('getArrayOrUndefined', () => {
    it('should return undefined if the input is not an array', () => {
      const x: { fields?: number[] } = {};
      const result = getArrayOrUndefined(x.fields);
      expect(result).to.be.undefined;
    });

    it('should return the array if the array is not empty', () => {
      const x: { fields?: number[] } = { fields: [1, 2, 3] };
      const result = getArrayOrUndefined(x.fields);
      expect(result).to.deep.equal([1, 2, 3]);
    });

    it('should return undefined if the array is empty', () => {
      const x: { fields?: number[] } = { fields: [] };
      const result = getArrayOrUndefined(x.fields);
      expect(result).to.be.undefined;
    });
  });

  describe('calcUnusedMinSerialNumber', () => {
    it('should return default value when list is empty', () => {
      const result = calcUnusedMinSerialNumber([], { fieldName: 'name', prefix: 'test' });
      expect(result).to.eq(1);
    });

    it('should return 1 when no items match the pattern', () => {
      const list = [{ name: 'invalid-format' }, { name: 'another-invalid' }, { name: '' }];
      const result = calcUnusedMinSerialNumber(list, { fieldName: 'name', prefix: 'test' });
      expect(result).to.eq(1);
    });

    it('should return the first unused positive integer', () => {
      const list = [{ name: 'test1' }, { name: 'test2' }, { name: 'test4' }];
      const result = calcUnusedMinSerialNumber(list, { fieldName: 'name', prefix: 'test' });
      expect(result).to.eq(3);
    });

    it('should handle non-sequential numbers', () => {
      const list = [{ name: 'test5' }, { name: 'test10' }, { name: 'test15' }];
      const result = calcUnusedMinSerialNumber(list, { fieldName: 'name', prefix: 'test' });
      expect(result).to.eq(1);
    });

    it('should ignore invalid field values', () => {
      const list = [{ name: null }, { name: 123 }, { name: '' }, { name: 'test2' }, { name: 'test3' }];
      const result = calcUnusedMinSerialNumber(list, { fieldName: 'name', prefix: 'test' });
      expect(result).to.eq(1);
    });

    it('should use custom default value', () => {
      const result = calcUnusedMinSerialNumber([], {
        fieldName: 'name',
        prefix: 'test',
        defaultNo: 5,
      });
      expect(result).to.eq(5);
    });

    it('should handle multiple digit numbers', () => {
      const list = [{ name: '名称1' }, { name: '名称2' }, { name: '测试' }, { name: '测试2' }, { name: '测试10' }, { name: '测试11' }];
      const result = calcUnusedMinSerialNumber(list, { fieldName: 'name', prefix: '测试' });
      expect(result).to.eq(3);
    });

    it('should work with different prefixes', () => {
      const list = [{ id: 'group1' }, { id: 'group3' }];
      const result = calcUnusedMinSerialNumber(list, { fieldName: 'id', prefix: 'group' });
      expect(result).to.eq(2);
    });
  });

  describe('percentRankOfSorted', () => {
    it('should return undefined for empty array', () => {
      expect(percentRankOfSorted([], 1)).to.be.undefined;
    });

    it('should return undefined for nullish value', () => {
      expect(percentRankOfSorted([1, 2, 3], undefined)).to.be.undefined;
      expect(percentRankOfSorted([1, 2, 3], null)).to.be.undefined;
    });

    it('should handle single-element array', () => {
      expect(percentRankOfSorted([5], 5)).to.eq(0);
      expect(percentRankOfSorted([5], 4)).to.be.undefined;
    });

    it('should return 0 for the minimum value and 1 for the maximum value', () => {
      const sorted = [1, 2, 3, 5, 8];
      expect(percentRankOfSorted(sorted, 1)).to.eq(0);
      expect(percentRankOfSorted(sorted, 8)).to.eq(1);
    });

    it('should return the rank for exact matches', () => {
      const sorted = [1, 2, 3, 5, 8];
      expect(percentRankOfSorted(sorted, 3)).to.eq(0.5);
    });

    it('should interpolate rank for values between adjacent points', () => {
      const sorted = [10, 20, 40, 50];
      expect(percentRankOfSorted(sorted, 30)).to.eq(0.5);
    });

    it('should use the first matched index when there are duplicate values', () => {
      const sorted = [1, 2, 3, 5, 5, 8];
      expect(percentRankOfSorted(sorted, 1)).to.eq(0);
      expect(percentRankOfSorted(sorted, 2)).to.eq(0.2);
      expect(percentRankOfSorted(sorted, 3)).to.eq(0.4);
      expect(percentRankOfSorted(sorted, 5)).to.eq(0.6);
      expect(percentRankOfSorted(sorted, 8)).to.eq(1);
    });

    it('should return undefined for values outside the sorted range', () => {
      const sorted = [1, 2, 3, 5, 8];
      expect(percentRankOfSorted(sorted, 0)).to.be.undefined;
      expect(percentRankOfSorted(sorted, 9)).to.be.undefined;
    });
  });

  describe('standardDeviation', () => {
    it('should return undefined for empty array', () => {
      expect(standardDeviation([])).to.be.undefined;
    });

    it('should return 0 for single-element array', () => {
      expect(standardDeviation([5])).to.eq(0);
    });

    it('should calculate population standard deviation for integer arrays', () => {
      expect(standardDeviation([10, 2, 38, 23, 38, 23, 21])).to.eq(12.29899614287479);
      expect(standardDeviation([1, 2, 3, 4, 5])).to.eq(1.4142135623730951);
    });

    it('should return the same result regardless of element order', () => {
      expect(standardDeviation([3, 1, 2])).to.eq(standardDeviation([1, 2, 3]));
    });
  });
});
