import React, { useState } from 'react';
import { useDeepCompareRef } from '../../src/react';

describe('useDeepCompareRef', () => {
  it('should return increase the signal ref value when deps change', () => {
    const TestComp = () => {
      const [state, setState] = useState({
        a: 1,
        b: [1, 2],
        c: { d: 1 },
      });

      const signalRef = useDeepCompareRef([state]);

      return (
        <>
          <div data-cy="signalRef">{signalRef.current}</div>
          <button data-cy="change-state" onClick={() => setState({ a: 1, b: [1, 2, 3], c: { d: 2 } })}>
            change filter
          </button>
        </>
      );
    };

    cy.mount(<TestComp />);

    cy.get('[data-cy=signalRef]').should('have.text', 1);
    cy.get('[data-cy=change-state]').click();
    cy.get('[data-cy=signalRef]').should('have.text', 2);
    cy.get('[data-cy=change-state]').click();
    cy.get('[data-cy=signalRef]').should('have.text', 2);
  });
});
