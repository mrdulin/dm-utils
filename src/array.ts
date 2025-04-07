export function moveMutable<T>(array: T[], fromIndex: number, toIndex: number): void {
  const startIndex = fromIndex < 0 ? array.length + fromIndex : fromIndex;

  if (startIndex >= 0 && startIndex < array.length) {
    const endIndex = toIndex < 0 ? array.length + toIndex : toIndex;

    const [item] = array.splice(fromIndex, 1);
    array.splice(endIndex, 0, item);
  }
}

export function moveImmutable<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  const newArray = [...array];
  moveMutable(newArray, fromIndex, toIndex);
  return newArray;
}

export function moveToStart<T>(array: T[], predicate: (item: T) => boolean): T[] {
  const index = array.findIndex(predicate);
  if (index < 0) return array;
  const newArray = [...array];
  moveMutable(newArray, index, 0);
  return newArray;
}

const removeSymbol = Symbol('Placeholder for removed element');
export const moveMulti = <T extends unknown>(arr: T[], indexes: number[], start: number): T[] => {
  const cloned: (T | Symbol)[] = arr.slice();
  for (let i = 0; i < cloned.length; i++) {
    if (indexes.includes(i)) {
      cloned[i] = removeSymbol;
    }
  }
  const els = arr.filter((__, i) => indexes.includes(i));
  cloned.splice(start, 0, ...els);
  return cloned.filter((v): v is T => v !== removeSymbol);
};

