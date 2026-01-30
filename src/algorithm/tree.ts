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

/**
 * 根据子节点查找父节点
 * @param tree
 * @param child 子节点
 * @param indentityKey 节点唯一id字段名称
 * @param childrenKey 节点的子节点的字段名称
 * @returns 父节点
 */
export const findParent = <T extends Record<string, any>>(
  tree: T | undefined,
  child: T | undefined,
  indentityKey = 'id',
  childrenKey = 'children',
): T | null => {
  if (tree === undefined || child === undefined) {
    return null;
  }
  const children = tree[childrenKey];
  if (Array.isArray(children)) {
    const count = children.length;
    for (let i = 0; i < count; i++) {
      if (children[i][indentityKey] === child[indentityKey]) {
        return tree;
      }
      const parent = findParent(children[i], child, indentityKey, childrenKey);
      if (parent !== null) {
        return parent;
      }
    }
  }
  return null;
};

/**
 * 查找节点路径
 * @param tree
 * @param func 符合条件的节点函数,返回 boolean
 * @param childrenKey 子节点key
 * @returns 节点路径
 */
export function findPath<T extends Record<string, any>>(tree: T[], func: (node: T) => boolean, childrenKey = 'children'): T[] | null {
  const path = [];
  const list = [...tree];
  const visitedSet = new Set();
  while (list.length) {
    const node = list[0];
    if (visitedSet.has(node)) {
      path.pop();
      list.shift();
    } else {
      visitedSet.add(node);
      Array.isArray(node[childrenKey]) && list.unshift(...node[childrenKey]);
      path.push(node);
      if (func(node)) return path;
    }
  }
  return null;
}

/**
 * 将树形结构展平为一维数组
 * 递归遍历树的所有节点，并将每个节点（不包含子节点属性）添加到结果数组中
 *
 * @template T - 树节点的类型
 * @param tree - 树形结构的数组
 * @param childrenKey - 子节点的属性名称，默认为 'children'
 * @returns 返回展平后的一维数组，每个元素是去除子节点属性后的节点对象
 *
 * @example
 * ```typescript
 * const tree = [
 *   {
 *     id: 1,
 *     name: '根节点',
 *     children: [
 *       { id: 2, name: '子节点1', children: [] },
 *       { id: 3, name: '子节点2', children: [] }
 *     ]
 *   }
 * ];
 *
 * const flattened = flatten(tree);
 * // 结果: [
 * //   { id: 1, name: '根节点' },
 * //   { id: 2, name: '子节点1' },
 * //   { id: 3, name: '子节点2' }
 * // ]
 * ```
 */
export function flatten<T extends Record<string, any>>(tree: T[], childrenKey = 'children'): Record<string, any>[] {
  const result: Record<string, any>[] = [];

  function traverse(node: T) {
    // 将当前节点添加到结果数组
    const { [childrenKey]: __, ...nodePropsOmitChildren } = node;
    result.push(nodePropsOmitChildren);
    const children: T[] | undefined = node[childrenKey];
    // 如果节点有子节点，则递归处理每个子节点
    if (children && Array.isArray(children) && children.length > 0) {
      children.forEach((child) => traverse(child));
    }
  }

  // 遍历树的每个根节点
  tree.forEach((root) => traverse(root));

  return result;
}
