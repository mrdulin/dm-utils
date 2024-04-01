import React, { useEffect, useState } from 'react';
import { cleanup, render, useMountedRef, useStateCallback } from '../src/react';

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

  describe('useMountedRef', () => {
    it('should return true if component is mounted', () => {
      const Test = () => {
        const mountedRef = useMountedRef();
        const [isMount, setIsMount] = useState<boolean>();

        useEffect(() => {
          setTimeout(() => {
            if (mountedRef.current) {
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
});
