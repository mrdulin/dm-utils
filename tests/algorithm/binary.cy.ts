import { binary } from '../../src/algorithm';

describe('binary', () => {
  describe('binarySearchIndex', () => {
    const arr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];

    it('should find the index of target element', () => {
      expect(binary.binarySearchIndex(arr, 5)).to.be.equal(2);
    });

    it('should find the previous index of target element', () => {
      expect(binary.binarySearchIndex(arr, 4, true)).to.be.equal(1);
    });

    it('should find the next index of target element', () => {
      expect(binary.binarySearchIndex(arr, 4, false, true)).to.be.equal(2);
    });
  });
});
