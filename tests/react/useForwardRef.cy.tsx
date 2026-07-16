import React, { useEffect } from 'react';
import { useForwardRef } from '../../src/react';

describe('useForwardRef', () => {
  it("should handle the Property 'current' does not exist on type '(instance: HTMLInputElement | null) => void' TS type error", () => {
    const Input = React.forwardRef<HTMLInputElement, React.ComponentPropsWithRef<'input'>>((props, ref) => {
      const forwardRef = useForwardRef<HTMLInputElement>(ref);
      useEffect(() => {
        forwardRef.current.focus();
      });
      return <input data-cy="input" type="text" ref={forwardRef} value={props.value} />;
    });

    cy.mount(<Input />);
    cy.get('[data-cy=input]').should('have.focus');
  });
});
