import { expectTypeOf } from 'expect-type';

import type { WithOptional, ExcludePickPartial, Undefinable, FunctionPropertyNames, NonFunctionPropertyNames, ValueOf } from '../src/types';

expectTypeOf<{ a: number; b: string; c?: string }>().branded.toEqualTypeOf<WithOptional<{ a: number; b: string; c: string }, 'c'>>();

expectTypeOf<{ a?: number; b?: string; c: string }>().branded.toEqualTypeOf<ExcludePickPartial<{ a: number; b: string; c: string }, 'c'>>();

expectTypeOf<{ a: string | undefined; b: number | undefined; c: boolean | undefined }>().toEqualTypeOf<
  Undefinable<{ a: string; b: number; c: boolean }>
>();

class A {
  add() {}
  minus() {}
  div() {}
  public result: number = 0;
}
expectTypeOf<'add' | 'minus' | 'div'>().toEqualTypeOf<FunctionPropertyNames<A>>();
expectTypeOf<'result'>().toEqualTypeOf<NonFunctionPropertyNames<A>>();

const t1 = {
  add() {},
  minus() {},
  div() {},
  result: 0,
};
expectTypeOf<'add' | 'minus' | 'div'>().toEqualTypeOf<FunctionPropertyNames<typeof t1>>();
expectTypeOf<'result'>().toEqualTypeOf<NonFunctionPropertyNames<typeof t1>>();

const map = {
  0: '0m',
  1: '1m',
  2: '2m',
  3: '3m',
  4: '4m',
  5: '5m',
  6: '6m',
} as const;

expectTypeOf<'0m' | '1m' | '2m' | '3m' | '4m' | '5m' | '6m'>().toEqualTypeOf<ValueOf<typeof map>>();
