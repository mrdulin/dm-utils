import React from 'react';

/**
 * react component 的增强类
 */
export class EnhancedComponent<P, S> extends React.Component<P, S> {
  /**
   * setState 方法的同步版本
   * @param state
   * @returns Promise
   */
  protected setStateAsync<K extends keyof S>(
    state: ((prevState: Readonly<S>, props: Readonly<P>) => Pick<S, K> | S | null) | (Pick<S, K> | S | null),
  ): Promise<void> {
    return new Promise<void>((resolve) => {
      this.setState(state, resolve);
    });
  }
}
