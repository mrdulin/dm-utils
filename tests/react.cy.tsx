import React, { useEffect, useState } from 'react';
import { UseCopyToClipboardProps, cleanup, render, useCopyToClipboard, useIsMounted, useStateCallback } from '../src/react';

describe('react', () => {
  describe('render', () => {
    it('should render component and return HTML string ', async () => {
      const Test = () => {
        return <div style={{ margin: 0 }}>test</div>;
      };
      const html = await render(<Test />);
      expect(html).to.equal('<div style="margin: 0px;">test</div>');
      expect(document.getElementById('template-container')).to.be.exist;
      cleanup();
      expect(document.getElementById('template-container')).to.not.be.exist;
    });
  });

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

  describe('useIsMounted', () => {
    it('should return true if component is mounted', () => {
      const Test = () => {
        const isMounted = useIsMounted();
        const [isMount, setIsMount] = useState<boolean>();

        useEffect(() => {
          setTimeout(() => {
            if (isMounted()) {
              setIsMount(true);
            }
          }, 1000);
        }, []);

        return <div data-cy="test">{isMount ? 'mount' : 'unmount'}</div>;
      };

      cy.mount(<Test />);

      cy.get('[data-cy=test]').should('have.text', 'mount');
    });
  });

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
});
