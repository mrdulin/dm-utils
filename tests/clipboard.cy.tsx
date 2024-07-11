import { useRef } from 'react';
import { clipboard } from '../src';

describe('clipboard', { viewportHeight: 600, viewportWidth: 800 }, () => {
  describe('writeImage', () => {
    it('should write image to clipboard', () => {
      const Test = () => {
        const ref = useRef<HTMLImageElement>(null);
        return (
          <div>
            <img ref={ref} src="../../cypress/fixtures/logo.png" alt="logo" />
            <button data-cy="copy" onClick={() => clipboard.writeImage(ref.current)}>
              copy
            </button>
          </div>
        );
      };

      cy.mount(<Test />);
      cy.get('[data-cy="copy"]').click();

      cy.window().then((win) => {
        win.navigator.clipboard.read().then((clipboardContents) => {
          expect(clipboardContents.length).to.eq(1);
          const item = clipboardContents[0];
          item.getType('image/png').then((blob) => {
            expect(blob).to.be.an.instanceOf(Blob);
          });
        });
      });
    });

    it('should write base64 image to clipboard', () => {
      const base64 =
        'data:application/octet-stream;base64,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';

      const Test = () => {
        const ref = useRef<HTMLImageElement>(null);
        return (
          <div>
            <img ref={ref} src={base64} alt="logo" />
            <button data-cy="copy" onClick={() => clipboard.writeImage(ref.current)}>
              copy
            </button>
          </div>
        );
      };

      cy.mount(<Test />);
      cy.get('[data-cy="copy"]').click();

      cy.window().then((win) => {
        win.navigator.clipboard.read().then((clipboardContents) => {
          expect(clipboardContents.length).to.eq(1);
          const item = clipboardContents[0];
          item.getType('image/png').then((blob) => {
            expect(blob).to.be.an.instanceOf(Blob);
          });
        });
      });
    });
  });

  describe('writeText', () => {
    it('should copy the text to clipboard', async () => {
      const text = 'foo';
      await clipboard.writeText(text);
      cy.window().then((win) => {
        win.navigator.clipboard.readText().then((copiedText) => {
          expect(copiedText).to.equal(text);
        });
      });
    });

    it('falls back to document.execCommand if navigator does not support clipboard', () => {
      cy.window().then((win) => {
        delete (win.navigator as any).__proto__.clipboard;
      });
      const TestComp = () => {
        return (
          <>
            <button data-cy="copy" onClick={() => clipboard.writeText('foo')}>
              copy
            </button>
            <textarea data-cy="input" />
          </>
        );
      };

      cy.document().then((doc) => cy.spy(doc, 'execCommand').as('execCommand'));

      cy.mount(<TestComp />);

      cy.get('[data-cy=copy]').click();
      cy.get('@execCommand').should('have.been.calledOnceWith', 'copy');

      cy.get('[data-cy=input]').focus();
      cy.document().invoke('execCommand', 'paste');
      cy.get('[data-cy=input]').should('have.value', 'foo');

      cy.get('#__textarea_for_clipboard__').should('not.exist');
    });

    it('print error log if execCommand fails', () => {
      cy.window().then((win) => {
        delete (win.navigator as any).__proto__.clipboard;
        cy.spy(win.console, 'error').as('consoleError');
      });
      const TestComp = () => {
        return (
          <button data-cy="copy" onClick={() => clipboard.writeText('foo')}>
            copy
          </button>
        );
      };

      cy.document().then((doc) => cy.stub(doc, 'execCommand').as('execCommand').returns(false));

      cy.mount(<TestComp />);

      cy.get('[data-cy=copy]').click();
      cy.get('@execCommand').should('have.been.calledOnceWith', 'copy');

      cy.get('@consoleError').should('have.been.calledWith', '复制文本失败, 操作不被支持或未被启用');
    });

    it('print error log if document.execCommand throws error', () => {
      cy.window().then((win) => {
        delete (win.navigator as any).__proto__.clipboard;
        cy.spy(win.console, 'error').as('consoleError');
      });
      const TestComp = () => {
        return (
          <button data-cy="copy" onClick={() => clipboard.writeText('foo').catch(alert)}>
            copy
          </button>
        );
      };

      const NotSupportError = new Error('not supported');
      cy.document().then((doc) => cy.stub(doc, 'execCommand').as('execCommand').throws(NotSupportError));

      cy.mount(<TestComp />);

      cy.get('[data-cy=copy]').click();
      cy.get('@execCommand').should('have.been.calledOnceWith', 'copy');

      cy.get('@consoleError').should('have.been.calledWith', '复制文本失败', NotSupportError);
      cy.on('window:alert', (error: Error) => {
        expect(error.message).to.be.equal(NotSupportError.message);
      });
    });
  });
});
