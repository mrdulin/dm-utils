declare module 'lodash.orderby' {
  type Many<T> = T | ReadonlyArray<T>;
  type Iteratee<T> = ((value: T) => unknown) | keyof T;
  type Order = 'asc' | 'desc';

  function orderBy<T>(
    collection: ReadonlyArray<T> | null | undefined,
    iteratees?: Many<Iteratee<T>>,
    orders?: Many<Order>,
  ): T[];

  export = orderBy;
}
