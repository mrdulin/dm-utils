import React from 'react';
import { cleanup, render } from '../react';

describe('react', () => {
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
