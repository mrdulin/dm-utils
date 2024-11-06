import { tree } from '../../src/algorithm';

describe('algorithm', () => {
  describe('tree.nodeCountAtDepth', () => {
    it('should pass', () => {
      const root = {
        id: 1,
        children: [
          { id: 2, children: [{ id: 21 }, { id: 22 }, { id: 23 }] },
          { id: 3, children: [{ id: 31 }, { id: 32 }, { id: 33 }] },
        ],
      };
      expect(tree.nodeCountAtDepth(root, 0)).to.be.equal(1);
      expect(tree.nodeCountAtDepth(root, 1)).to.be.equal(2);
      expect(tree.nodeCountAtDepth(root, 2)).to.be.equal(6);
    });
  });
});
