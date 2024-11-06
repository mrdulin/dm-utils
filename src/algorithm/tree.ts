/**
 * 计算指定层级的节点数量
 * @param root tree data
 * @param depth 需要计算节点数量的层级
 * @param childrenKey 子节点key
 * @returns 节点数量
 */
export const nodeCountAtDepth = (root: Record<string, any>, depth: number, childrenKey: string = 'children'): number => {
  const depths: Record<number, number> = { 0: 1 };

  (function recurTree(node: Record<string, any>, level: number) {
    level++;

    const children: Record<string, any>[] = node[childrenKey] ?? [];

    if (depths[level] === undefined) {
      depths[level] = children.length;
    } else {
      depths[level] += children.length;
    }

    if (level + 1 > depth) return;
    for (let i = 0; i < children.length; i++) {
      recurTree(children[i], level);
    }
  })(root, 0);

  return depths[depth];
};

