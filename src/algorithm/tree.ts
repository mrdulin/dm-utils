/**
 * 计算指定层级的节点数量
 * @param root tree data 对象
 * @param depth 需要计算节点数量的层级
 * @param childrenKey 子节点key
 * @returns 节点数量
 */
export const nodeCountAtDepth = <T extends Record<string, any>>(root: T, depth: number, childrenKey: string = 'children'): number => {
  const depths: Record<number, number> = { 0: 1 };

  (function recurTree(node: Record<string, any>, level: number) {
    level++;

    const children: T[] = node[childrenKey] ?? [];

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

/**
 * 找到符合条件的节点
 * @param tree tree data 数组
 * @param predicate 对每个节点执行的函数, 如果返回true, 则返回该节点
 * @param childrenKey 子节点key
 * @returns 找到的节点
 */
export const findNode = <T extends Record<string, any>>(tree: T[], predicate: (node: T) => boolean, childrenKey = 'children'): T | null => {
  const list = [...tree];
  for (const node of list) {
    if (predicate(node)) return node;
    Array.isArray(node[childrenKey]) && list.push(...node[childrenKey]);
  }
  return null;
};
