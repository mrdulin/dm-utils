import { useRef } from 'react';
import { clipboard } from '../';

describe('clipboard', { viewportHeight: 600, viewportWidth: 800 }, () => {
  it('should write image to clipboard', () => {
    const Test = () => {
      const ref = useRef();
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
});
