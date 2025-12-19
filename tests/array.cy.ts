import { calcUnusedMinSerialNumber, getArrayOrUndefined, moveMulti, moveToStart } from '../src/array';

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
      const list = [{ name: 'test1' }, { name: 'test2' }, { name: 'test100' }];
      const result = calcUnusedMinSerialNumber(list, { fieldName: 'name', prefix: 'test' });
      expect(result).to.eq(3);
    });

    it('should work with different prefixes', () => {
      const list = [{ id: 'group1' }, { id: 'group3' }];
      const result = calcUnusedMinSerialNumber(list, { fieldName: 'id', prefix: 'group' });
      expect(result).to.eq(2);
    });
  });
});
