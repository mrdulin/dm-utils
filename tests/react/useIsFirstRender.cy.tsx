import React from 'react';
import { useIsFirstRender } from '../../src/react';

describe('useIsFirstRender', () => {
  it('should return true on first render', () => {
    const TestComp = () => {
      const isFirstRender = useIsFirstRender();
      const [, rerender] = React.useReducer((x) => x + 1, 1);

      return (
        <div>
          <div data-cy="is-first-render">{isFirstRender ? 'true' : 'false'}</div>
          <button className="primary" onClick={rerender}>
            re-render
          </button>
        </div>
      );
    };

    cy.mount(<TestComp />);
    cy.get('[data-cy=is-first-render]').should('have.text', 'true');

    cy.get('.primary').click();
    cy.get('[data-cy=is-first-render]').should('have.text', 'false');
  });
});
