import { moveMulti } from '../src/algorithm';

describe('algorithm', () => {
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
