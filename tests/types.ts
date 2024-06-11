import { expectTypeOf } from 'expect-type';

import type { WithOptional, ExcludePickPartial, Undefinable } from '../src/types';

expectTypeOf<{ a: number; b: string; c?: string }>().toMatchTypeOf<WithOptional<{ a: number; b: string; c: string }, 'c'>>();

expectTypeOf<{ a?: number; b?: string; c: string }>().toMatchTypeOf<ExcludePickPartial<{ a: number; b: string; c: string }, 'c'>>();

expectTypeOf<{ a: string | undefined; b: number | undefined; c: boolean | undefined }>().toMatchTypeOf<
  Undefinable<{ a: string; b: number; c: boolean }>
>();
