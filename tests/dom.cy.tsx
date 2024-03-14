import { useRef } from 'react';
import { dom } from '../src';

describe('dom', () => {
  it('should scroll to top of a container', () => {
    const data = Array.from({ length: 10 }).map(() => Math.random());
    const Test = () => {
      const ref = useRef<HTMLImageElement>(null);
      return (
        <div data-cy="scrollable-container" ref={ref} style={{ height: 300, width: 200, overflow: 'auto' }}>
          <ul>
            {data.map((v, i) => (
              <li key={i} style={{ lineHeight: 2 }}>
                {v}
              </li>
            ))}
          </ul>
          <button data-cy="scroll-to-top" onClick={() => dom.scrollToTop(ref.current)}>
            ↑Top
          </button>
        </div>
      );
    };

    cy.mount(<Test />);

    cy.get('[data-cy="scrollable-container"]').scrollTo('bottom');

    cy.get('[data-cy="scrollable-container"]').then(($el) => {
      expect($el[0].scrollTop).to.be.a('number');
      expect($el[0].scrollTop).to.be.greaterThan(0);
    });

    cy.get('[data-cy="scroll-to-top"]').click();

    cy.get('[data-cy="scrollable-container"]').then(($el) => {
      expect($el[0].scrollTop).to.be.a('number');
      expect($el[0].scrollTop).to.equal(0);
    });
  });
});
