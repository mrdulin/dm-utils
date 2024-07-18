import React from 'react';
import { expectTypeOf } from 'expect-type';
import type { InferRef } from '../src/react/types';

interface ChildRefProps {
  prop1: () => void;
  prop2: () => void;
}
interface ChildProps {
  otherProp: string;
}

const Child = React.forwardRef<ChildRefProps, ChildProps>((props, ref) => {
  React.useImperativeHandle(
    ref,
    () => ({
      prop1() {},
      prop2() {},
    }),
    [],
  );

  return null;
});

type InferredChildRef = InferRef<typeof Child>;

const Parent = () => {
  const childRef = React.useRef<InferredChildRef>(null);

  return <Child ref={childRef} otherProp="a" />;
};

expectTypeOf<ChildRefProps>().toMatchTypeOf<InferredChildRef>()