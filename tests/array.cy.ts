import { moveToStart } from '../src/array';

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
  });
});
