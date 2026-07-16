import React, { useEffect } from 'react';
import { useStateCallback } from '../../src/react';

describe('useStateCallback', () => {
  it('should set the state correctly and get the nextState in callback', () => {
    const Test = () => {
      const [state, setState] = useStateCallback('foo');

      useEffect(() => {
        setState('bar', (nextState) => {
          setState(nextState + '!');
        });
      }, []);

      return <div data-cy="test">{state}</div>;
    };

    cy.mount(<Test />);

    cy.get('[data-cy=test]').should('have.text', 'bar!');
  });
});
