import React from 'react';
import { UseCopyToClipboardProps, useCopyToClipboard } from '../../src/react';

describe('useCopyToClipboard', () => {
  it('should copy to clipboard', () => {
    cy.clock();
    const Test = () => {
      const { isCopied, copyToClipboard } = useCopyToClipboard();
      return (
        <>
          <div data-cy="copy-state">{isCopied ? 'copied' : ''}</div>
          <button data-cy="copy-button" onClick={() => copyToClipboard('foo')}>
            copy
          </button>
        </>
      );
    };

    cy.mount(<Test />);

    cy.get('[data-cy=copy-button]').click();
    cy.get('[data-cy=copy-state]').should('have.text', 'copied');

    cy.window().then((win) => {
      win.navigator.clipboard.readText().then((text) => {
        expect(text).to.equal('foo');
      });
    });

    cy.tick(2000);
    cy.get('[data-cy=copy-state]').should('have.text', '');
  });

  it('should copy to clipboard with success callback', () => {
    const Test = ({ onCopy }: Pick<UseCopyToClipboardProps, 'onCopy'>) => {
      const { copyToClipboard } = useCopyToClipboard({ onCopy });
      return (
        <button data-cy="copy-button" onClick={() => copyToClipboard('foo')}>
          copy
        </button>
      );
    };

    const onCopySpy = cy.spy().as('onCopySpy');

    cy.mount(<Test onCopy={onCopySpy} />);

    cy.get('[data-cy=copy-button]').click();
    cy.get('@onCopySpy').should('have.been.calledWith', 'foo');
  });

  it('should copy failed if value is an empty string', () => {
    const Test = ({ onError }: Pick<UseCopyToClipboardProps, 'onError'>) => {
      const { copyToClipboard } = useCopyToClipboard({ onError });
      return (
        <button data-cy="copy-button" onClick={() => copyToClipboard('')}>
          copy
        </button>
      );
    };

    const onErrorSpy = cy.spy().as('onErrorSpy');

    cy.mount(<Test onError={onErrorSpy} />);

    cy.get('[data-cy=copy-button]').click();
    cy.get('@onErrorSpy').should(
      'have.been.calledWith',
      Cypress.sinon.match(
        Cypress.sinon.match.instanceOf(Error).and(Cypress.sinon.match.has('message', 'Cannot copy empty string to clipboard.')),
      ),
    );
  });
});
