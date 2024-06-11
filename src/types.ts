/** 指定的属性变为可选 */
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** 除了 K 的其他属性变成可选 */
export type ExcludePickPartial<T, K extends keyof T> = Partial<Omit<T, K>> & Pick<T, K>;

export type Undefinable<T> = { [K in keyof T]: T[K] | undefined };
