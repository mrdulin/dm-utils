/** 指定的属性变为可选 */
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** 除了 K 的其他属性变成可选 */
export type ExcludePickPartial<T, K extends keyof T> = Partial<Omit<T, K>> & Pick<T, K>;

export type Undefinable<T> = { [K in keyof T]: T[K] | undefined };

/** 获取对象中的方法名称，返回union type */
export type FunctionPropertyNames<T> = { [P in keyof T]-?: T[P] extends Function ? P : never }[keyof T];
/** 获取对象中非函数属性名称，返回union type */
export type NonFunctionPropertyNames<T> = { [P in keyof T]-?: T[P] extends Function ? never : P }[keyof T];

/** 获取对象中key的值，返回由这些值组成的union type */
export type ValueOf<T> = T[keyof T];
