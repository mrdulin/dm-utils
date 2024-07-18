import type { ForwardRefExoticComponent } from 'react';

// https://stackoverflow.com/a/76735017/6463558
export type InferRef<T> = T extends ForwardRefExoticComponent<infer Ref>
  ? Ref extends React.RefAttributes<infer RefElement>
    ? RefElement
    : never
  : never;
