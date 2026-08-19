import { expectTypeOf } from 'expect-type';

import type {
  WithOptional,
  ExcludePickPartial,
  Undefinable,
  Nullishable,
  Optional,
  NullableValue,
  FunctionPropertyNames,
  NonFunctionPropertyNames,
  ValueOf,
  WithRequired,
  WithUndefinable,
  Simplify,
  Mutable,
  DeepStringLeafValues,
} from '../src/types';
import type { TextMeasurer, TextSize } from '../src/dom';

expectTypeOf<{ a: number; b: string; c?: string }>().branded.toEqualTypeOf<WithOptional<{ a: number; b: string; c: string }, 'c'>>();

expectTypeOf<{ a?: number; b?: string; c: string }>().branded.toEqualTypeOf<ExcludePickPartial<{ a: number; b: string; c: string }, 'c'>>();

expectTypeOf<{ a: string | undefined; b: number | undefined; c: boolean | undefined }>().toEqualTypeOf<
  Undefinable<{ a: string; b: number; c: boolean }>
>();

expectTypeOf<string | undefined | null>().toEqualTypeOf<Nullishable<string>>();
expectTypeOf<number | undefined>().toEqualTypeOf<Optional<number>>();
expectTypeOf<boolean | null>().toEqualTypeOf<NullableValue<boolean>>();

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

type WithRequiredInput = {
  a: number;
  b?: string;
};

expectTypeOf<{ a: number; b: string }>().branded.toEqualTypeOf<WithRequired<WithRequiredInput, 'b'>>();

type WithUndefinableInput = {
  a: number;
  b: string;
  c?: boolean;
};

expectTypeOf<{ a: number; b: string | undefined; c?: boolean | undefined }>().branded.toEqualTypeOf<
  WithUndefinable<WithUndefinableInput, 'b' | 'c'>
>();

type SimplifyInput = { a: number } & { b: string };
type SimplifyOutput = Simplify<SimplifyInput>;

expectTypeOf<{ a: number; b: string }>().branded.toEqualTypeOf<SimplifyOutput>();

type MutableInput = {
  readonly a: number;
  readonly b: string;
};

expectTypeOf<{ a: number; b: string }>().branded.toEqualTypeOf<Mutable<MutableInput>>();

type DeepStringLeafValuesInput = {
  code: '240215';
  issuer: {
    name: '国家开发银行';
    type: '政策性银行';
  };
  duration: number;
  active: boolean;
};

expectTypeOf<'240215' | '国家开发银行' | '政策性银行'>().toEqualTypeOf<DeepStringLeafValues<DeepStringLeafValuesInput>>();

expectTypeOf<ReturnType<TextMeasurer['measure']>>().toEqualTypeOf<TextSize>();
