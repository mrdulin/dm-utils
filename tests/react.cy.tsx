import React, { useEffect } from 'react';
import { cleanup, render, useStateCallback } from '../src/react';

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
});
