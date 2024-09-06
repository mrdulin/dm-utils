import type {
  ForwardRefExoticComponent,
  NamedExoticComponent,
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  RefAttributes,
  ElementType,
} from 'react';

export type ComponentRef<T extends ElementType> = T extends NamedExoticComponent<ComponentPropsWithoutRef<T> & RefAttributes<infer Method>>
  ? Method
  : ComponentPropsWithRef<T> extends RefAttributes<infer Method>
  ? Method
  : never;

// https://stackoverflow.com/a/76735017/6463558
export type InferRef<T> = T extends ForwardRefExoticComponent<infer Ref>
  ? Ref extends React.RefAttributes<infer RefElement>
    ? RefElement
    : never
  : never;

type ReactRefComponent<Props extends { ref?: React.Ref<any> | string }> = (props: Props) => React.ReactNode;

type ExtractRefAttributesRef<T> = T extends React.RefAttributes<infer P> ? P : never;

export type GetRef<T extends ReactRefComponent<any> | React.Component<any>> = T extends React.Component<any>
  ? T
  : T extends React.ComponentType<infer P>
  ? ExtractRefAttributesRef<P>
  : never;
