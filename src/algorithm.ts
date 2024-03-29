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
