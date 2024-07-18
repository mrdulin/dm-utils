import { expectTypeOf } from 'expect-type';

import type { WithOptional, ExcludePickPartial, Undefinable, FunctionPropertyNames, NonFunctionPropertyNames } from '../src/types';

expectTypeOf<{ a: number; b: string; c?: string }>().toMatchTypeOf<WithOptional<{ a: number; b: string; c: string }, 'c'>>();

expectTypeOf<{ a?: number; b?: string; c: string }>().toMatchTypeOf<ExcludePickPartial<{ a: number; b: string; c: string }, 'c'>>();

expectTypeOf<{ a: string | undefined; b: number | undefined; c: boolean | undefined }>().toMatchTypeOf<
  Undefinable<{ a: string; b: number; c: boolean }>
>();

class A {
  add() {}
  minus() {}
  div() {}
  public result: number = 0;
}
expectTypeOf<'add' | 'minus' | 'div'>().toMatchTypeOf<FunctionPropertyNames<A>>();
expectTypeOf<'result'>().toMatchTypeOf<NonFunctionPropertyNames<A>>();

const t1 = {
  add() {},
  minus() {},
  div() {},
  result: 0,
};
expectTypeOf<'add' | 'minus' | 'div'>().toMatchTypeOf<FunctionPropertyNames<typeof t1>>();
expectTypeOf<'result'>().toMatchTypeOf<NonFunctionPropertyNames<typeof t1>>();
