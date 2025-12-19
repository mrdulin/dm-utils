/**
 * 创建一个新类型，将指定属性设为可选
 *
 * @template T - 原始对象类型
 * @template K - 要设为可选的属性键名联合类型，必须是T的键的子集
 *
 * @example
 * ```typescript
 * type User = {
 *   id: number;
 *   name: string;
 *   email: string;
 * };
 *
 * // 将email属性设为可选
 * type UserWithOptionalEmail = WithOptional<User, 'email'>;
 * // 等价于: { id: number; name: string; email?: string | undefined; }
 * ```
 */
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * 创建一个新类型，该类型包含原类型T的部分属性和指定属性K的完整属性
 *
 * @template T - 原始对象类型
 * @template K - 需要保持完整的属性键名，必须是T的键名的子集
 *
 * @description
 * 该类型工具首先使用Omit排除类型T中的属性K，然后对剩余属性应用Partial使其变为可选，
 * 同时使用Pick提取属性K并保持其完整性，最后将两部分进行交叉合并。
 * 结果类型中，除了K指定的属性保持必需外，其他所有属性都变为可选。
 */
export type ExcludePickPartial<T, K extends keyof T> = Partial<Omit<T, K>> & Pick<T, K>;

/**
 * 定义一个工具类型Undefinable，用于将传入类型的每个属性都变为可选（即允许undefined）
 *
 * @template T - 需要处理的原始类型
 * @returns 返回一个新的类型，该类型的每个属性都是原类型对应属性的联合类型加上undefined
 */
export type Undefinable<T> = { [K in keyof T]: T[K] | undefined };

/**
 * 获取对象类型中所有函数类型的属性名
 *
 * @template T - 要检查的对象类型
 * @returns 返回T类型中所有值为函数的属性名组成的联合类型
 *
 * @example
 * ```typescript
 * type Example = {
 *   name: string;
 *   age: number;
 *   getName(): string;
 *   getAge: () => number;
 * };
 *
 * // 结果为 "getName" | "getAge"
 * type FunctionProps = FunctionPropertyNames<Example>;
 * ```
 */
export type FunctionPropertyNames<T> = { [P in keyof T]-?: T[P] extends Function ? P : never }[keyof T];

/**
 * 获取对象类型中所有非函数属性的属性名联合类型
 *
 * @template T - 要处理的对象类型
 *
 * @example
 * ```typescript
 * type Example = {
 *   name: string;
 *   age: number;
 *   getName(): string;
 * };
 *
 * // 结果为 "name" | "age"
 * type Result = NonFunctionPropertyNames<Example>;
 * ```
 *
 * @returns 返回T类型中所有非函数属性的属性名组成的联合类型
 */
export type NonFunctionPropertyNames<T> = { [P in keyof T]-?: T[P] extends Function ? never : P }[keyof T];

/**
 * 获取对象类型T的所有值类型的联合类型
 *
 * 该工具类型通过 keyof T 获取对象T的所有键名，然后使用索引访问操作符 [keyof T]
 * 来获取所有键对应的值类型，最终得到一个联合类型包含所有可能的值类型
 *
 * @example
 * ```typescript
 * type Person = {
 *   name: string;
 *   age: number;
 *   active: boolean;
 * };
 *
 * // 结果类型为 string | number | boolean
 * type PersonValues = ValueOf<Person>;
 * ```
 */
export type ValueOf<T> = T[keyof T];

/**
 * 创建一个新类型，将指定属性设为必需
 *
 * @template T 原始对象类型
 * @template K 需要设为必需的属性名联合类型，必须是T的键的子集
 * @returns 返回一个新的交叉类型，包含原始类型T和将K中属性设为必需后的类型
 *
 * @example
 * type User = { name?: string; age?: number; email?: string };
 * type UserWithRequiredName = WithRequired<User, 'name'>;
 * // 结果: { name: string; age?: number; email?: string }
 */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/**
 * 定义一个工具类型 Nullable，用于将传入类型的每个属性都变为可为空的联合类型
 *
 * @template T - 需要处理的原始类型
 * @returns 返回一个新的类型，该类型的所有属性都与原始类型相同，但每个属性的值类型都扩展了 null 类型
 */
export type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};
