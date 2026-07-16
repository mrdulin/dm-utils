import React, { useEffect, useState } from 'react';
import { useIsMounted } from '../../src/react';

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
