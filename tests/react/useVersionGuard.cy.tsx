import React, { useState } from 'react';
import { useVersionGuard } from '../../src/react';

describe('useVersionGuard', () => {
  it('should ignore stale async results after dependencies change', () => {
    cy.clock();

    const TestComp = () => {
      const [userId, setUserId] = useState('first');
      const [value, setValue] = useState('idle');
      const { captureVersion, isCurrentVersion } = useVersionGuard([userId]);

      const request = (nextValue: string) => {
        const version = captureVersion();

        setTimeout(() => {
          if (isCurrentVersion(version)) {
            setValue(nextValue);
          }
        }, 1000);
      };

      return (
        <div>
          <div data-cy="user-id">{userId}</div>
          <div data-cy="value">{value}</div>
          <button data-cy="request-first" onClick={() => request('first result')}>
            request first
          </button>
          <button data-cy="change-user-id" onClick={() => setUserId('second')}>
            change user id
          </button>
          <button data-cy="request-second" onClick={() => request('second result')}>
            request second
          </button>
        </div>
      );
    };

    cy.mount(<TestComp />);

    cy.get('[data-cy=request-first]').click();
    cy.get('[data-cy=change-user-id]').click();
    cy.get('[data-cy=request-second]').click();
    cy.tick(1000);

    cy.get('[data-cy=user-id]').should('have.text', 'second');
    cy.get('[data-cy=value]').should('have.text', 'second result');
  });

  it('should keep current version when dependencies are deeply equal', () => {
    cy.clock();

    const TestComp = () => {
      const [filter, setFilter] = useState({ keyword: 'bond', status: 'active' });
      const [value, setValue] = useState('idle');
      const { captureVersion, isCurrentVersion } = useVersionGuard([filter]);

      const request = () => {
        const version = captureVersion();

        setTimeout(() => {
          if (isCurrentVersion(version)) {
            setValue('current result');
          }
        }, 1000);
      };

      return (
        <div>
          <div data-cy="value">{value}</div>
          <button data-cy="request" onClick={request}>
            request
          </button>
          <button data-cy="set-equal-filter" onClick={() => setFilter({ keyword: 'bond', status: 'active' })}>
            set equal filter
          </button>
        </div>
      );
    };

    cy.mount(<TestComp />);

    cy.get('[data-cy=request]').click();
    cy.get('[data-cy=set-equal-filter]').click();
    cy.tick(1000);

    cy.get('[data-cy=value]').should('have.text', 'current result');
  });
});
