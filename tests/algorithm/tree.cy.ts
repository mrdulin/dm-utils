import { tree } from '../../src/algorithm';

const root = {
  id: 1,
  children: [
    { id: 2, children: [{ id: 21 }, { id: 22 }, { id: 23 }] },
    { id: 3, children: [{ id: 31 }, { id: 32 }, { id: 33 }] },
  ],
};


describe('tree', () => {
  describe('nodeCountAtDepth', () => {
    it('should pass', () => {
      expect(tree.nodeCountAtDepth(root, 0)).to.be.equal(1);
      expect(tree.nodeCountAtDepth(root, 1)).to.be.equal(2);
      expect(tree.nodeCountAtDepth(root, 2)).to.be.equal(6);
    });
  });

  describe('findNode', () => {
    it('should find leaf node', () => {
      const actual = tree.findNode([root], (node) => node.id === 3);
      expect(actual).to.be.deep.equal(root.children[1]);

      const actual2 = tree.findNode([root], (node) => node.id === 33);
      expect(actual2).to.be.deep.equal(root.children[1].children[2]);
    });
  });
});
