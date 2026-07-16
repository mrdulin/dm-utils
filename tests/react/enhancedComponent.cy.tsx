import React from 'react';
import { EnhancedComponent } from '../../src/react';

describe('EnhancedComponent', () => {
  it('should set the state correctly and get the nextState in callback', () => {
    class TestComponent extends EnhancedComponent<{ onClick: () => void }, { pageIndex: number }> {
      state = {
        pageIndex: 1,
      };

      async onClick() {
        await this.setStateAsync({ pageIndex: 2 });
        onClickSpy(this.state.pageIndex);
      }

      render() {
        return (
          <button data-cy="test-button" onClick={() => this.onClick()}>
            click
          </button>
        );
      }
    }

    const onClickSpy = cy.spy().as('onClickSpy');

    cy.mount(<TestComponent onClick={onClickSpy} />);

    cy.get('[data-cy=test-button]').click();
    cy.get('@onClickSpy').should('have.been.calledWith', 2);
  });
});
