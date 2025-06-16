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

    it('should find parent node', () => {
      const actual = tree.findNode([root], (node) => node.children.findIndex((n) => n.id === 33) > -1);
      expect(actual).to.be.deep.equal(root.children[1]);
    });
  });

  describe('findParent', () => {
    it('should find parent node with default indentityKey and childrenKey', () => {
      const actual = tree.findParent(root, root.children[1].children[2]);
      expect(actual).to.be.deep.equal(root.children[1]);
    });

    it('should find parent node with specified indentityKey and childrenKey', () => {
      const treeData = {
        code: 1,
        subs: [
          { code: 2, subs: [{ code: 21 }, { code: 22 }, { code: 23 }] },
          { code: 3, subs: [{ code: 31 }, { code: 32 }, { code: 33 }] },
        ],
      };

      const actual = tree.findParent(treeData, treeData.subs[1].subs[2], 'code', 'subs');
      expect(actual).to.be.deep.equal(treeData.subs[1]);
    });
  });

  describe('findPath', () => {
    it('should find path', () => {
      const actual = tree.findPath([root], (node) => node.id === 33);
      expect(actual).to.be.deep.equal([root, root.children[1], root.children[1].children[2]]);
    });

    it('should return null if not found', () => {
      const actual = tree.findPath([root], (node) => node.id === 34);
      expect(actual).to.be.null;
    });
  });

  describe('flatten', () => {
    it('should flatten tree and omit the "children" property', () => {
      const treeData = {
        id: 1,
        title: 'a',
        children: [
          {
            id: 2,
            title: 'a-c1',
            children: [
              { id: 21, title: 'a-c1-c1' },
              { id: 22, title: 'a-c1-c2' },
              { id: 23, title: 'a-c1-c3' },
            ],
          },
          {
            id: 3,
            title: 'a-c2',
            children: [
              { id: 31, title: 'a-c2-c1' },
              { id: 32, title: 'a-c2-c2' },
              { id: 33, title: 'a-c2-c3' },
            ],
          },
        ],
      };
      const actual = tree.flatten([treeData]);
      expect(actual).to.be.deep.equal([
        { id: 1, title: 'a' },
        { id: 2, title: 'a-c1' },
        { id: 21, title: 'a-c1-c1' },
        { id: 22, title: 'a-c1-c2' },
        { id: 23, title: 'a-c1-c3' },
        { id: 3, title: 'a-c2' },
        { id: 31, title: 'a-c2-c1' },
        { id: 32, title: 'a-c2-c2' },
        { id: 33, title: 'a-c2-c3' },
      ]);
    });
  });
});
