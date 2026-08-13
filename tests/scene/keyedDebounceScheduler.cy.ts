import { createKeyedDebounceScheduler } from '../../src/scene';

describe('scene/keyedDebounceScheduler', () => {
  beforeEach(() => {
    cy.clock();
  });

  it('should only execute the latest callback for the same key', () => {
    const scheduler = createKeyedDebounceScheduler<string>(100);
    const calls: string[] = [];

    scheduler.schedule('record-1', () => calls.push('first'));
    cy.tick(50);
    cy.then(() => {
      scheduler.schedule('record-1', () => calls.push('latest'));
    });

    cy.tick(99);
    cy.then(() => {
      expect(calls).to.deep.equal([]);
    });
    cy.tick(1);
    cy.then(() => {
      expect(calls).to.deep.equal(['latest']);
    });
  });

  it('should schedule different keys independently', () => {
    const scheduler = createKeyedDebounceScheduler<string>(100);
    const calls: string[] = [];

    scheduler.schedule('record-1', () => calls.push('record-1'));
    scheduler.schedule('record-2', () => calls.push('record-2'));

    cy.tick(100);
    cy.then(() => {
      expect(calls).to.deep.equal(['record-1', 'record-2']);
    });
  });

  it('should cancel a pending callback by key', () => {
    const scheduler = createKeyedDebounceScheduler<string>(100);
    const callback = cy.stub();

    scheduler.schedule('record-1', callback);
    scheduler.cancel('record-1');
    cy.tick(100);

    cy.then(() => {
      expect(callback).not.to.have.been.called;
    });
  });

  it('should allow scheduling again after cancelling a key', () => {
    const scheduler = createKeyedDebounceScheduler<string>(100);
    const calls: string[] = [];

    scheduler.schedule('record-1', () => calls.push('cancelled'));
    scheduler.cancel('record-1');
    scheduler.schedule('record-1', () => calls.push('rescheduled'));
    cy.tick(100);

    cy.then(() => {
      expect(calls).to.deep.equal(['rescheduled']);
    });
  });

  it('should cancel all callbacks when disposed and ignore later schedules', () => {
    const scheduler = createKeyedDebounceScheduler<string>(100);
    const callback = cy.stub();

    scheduler.schedule('record-1', callback);
    scheduler.dispose();
    scheduler.schedule('record-2', callback);
    cy.tick(100);

    cy.then(() => {
      expect(callback).not.to.have.been.called;
    });
  });
});
