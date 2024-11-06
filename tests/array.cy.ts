import { moveMulti, moveToStart } from '../src/array';

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
});
