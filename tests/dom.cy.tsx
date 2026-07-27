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

  describe('convertRgbToHexInHtml', () => {
    it('should convert rgb color to hex format', () => {
      const html = '<div style="color: rgb(255, 0, 0)">Red text</div>';
      const result = dom.convertRgbToHexInHtml(html);
      expect(result).to.equal('<div style="color: #FF0000">Red text</div>');
    });

    it('should convert rgba color to hex format with alpha', () => {
      const html = '<p style="background-color: rgba(0, 255, 0, 0.5)">Green bg</p>';
      const result = dom.convertRgbToHexInHtml(html);
      expect(result).to.equal('<p style="background-color: #00FF0080">Green bg</p>');
    });

    it('should handle multiple color values in the same string', () => {
      const html = '<div style="color: rgb(255, 0, 0); background: rgb(0, 0, 255)">Text</div>';
      const result = dom.convertRgbToHexInHtml(html);
      expect(result).to.equal('<div style="color: #FF0000; background: #0000FF">Text</div>');
    });

    it('should handle rgb with percentage values', () => {
      const html = '<div style="color: rgb(100%, 50%, 0%)">Text</div>';
      const result = dom.convertRgbToHexInHtml(html);
      expect(result).to.equal('<div style="color: #FF7F00">Text</div>'); // 255, 127.5~128, 0
    });

    it('should handle rgba with decimal values', () => {
      const html = '<div style="color: rgba(255.0, 128.5, 0, 0.8)">Text</div>';
      const result = dom.convertRgbToHexInHtml(html);
      expect(result).to.equal('<div style="color: #FF8000CC">Text</div>'); // 0.8 * 255 ≈ 204 (CC)
    });

    it('should handle values outside normal ranges (clamping)', () => {
      const html = '<div style="color: rgb(300, -50, 100)">Text</div>';
      const result = dom.convertRgbToHexInHtml(html);
      expect(result).to.equal('<div style="color: #FF0064">Text</div>'); // Clamped: 255, 0, 100
    });

    it('should handle alpha values outside 0-1 range (clamping)', () => {
      const html = '<div style="color: rgba(255, 0, 0, 1.5)">Text</div>';
      const result = dom.convertRgbToHexInHtml(html);
      expect(result).to.equal('<div style="color: #FF0000FF">Text</div>'); // Clamped alpha: 1.0 = 255 (FF)
    });

    it('should return original string when no rgb/rgba values are present', () => {
      const html = '<div style="color: #FF0000">Red text</div>';
      const result = dom.convertRgbToHexInHtml(html);
      expect(result).to.equal(html);
    });

    it('should handle complex HTML with multiple color formats', () => {
      const html = '<div style="color: rgb(255, 0, 0); background: #00FF00"><p style="color: rgba(0, 0, 255, 0.5)">Content</p></div>';
      const result = dom.convertRgbToHexInHtml(html);
      expect(result).to.equal('<div style="color: #FF0000; background: #00FF00"><p style="color: #0000FF80">Content</p></div>');
    });

    it('should handle integer alpha values', () => {
      const html = '<div style="color: rgba(255, 0, 0, 1)">Text</div>';
      const result = dom.convertRgbToHexInHtml(html);
      expect(result).to.equal('<div style="color: #FF0000FF">Text</div>'); // Alpha 1.0 = 255 (FF)
    });

    it('should handle spaces in rgb functions', () => {
      const html = '<div style="color: rgb( 255 , 0 , 0 )">Text</div>';
      const result = dom.convertRgbToHexInHtml(html);
      expect(result).to.equal('<div style="color: #FF0000">Text</div>');
    });
  });

  describe('createTextMeasurer', () => {
    let measurer: ReturnType<typeof dom.createTextMeasurer> | undefined;

    beforeEach(() => {
      measurer = dom.createTextMeasurer();
    });

    afterEach(() => {
      measurer?.dispose();
    });

    it('should preserve explicit css size values', () => {
      cy.document().then((doc) => {
        const appendChild = doc.body.appendChild.bind(doc.body);
        let appended: HTMLDivElement | null = null;

        cy.stub(doc.body, 'appendChild').callsFake((node: Node) => {
          appended = node as HTMLDivElement;
          return appendChild(node);
        });

        const size = measurer!.measure({
          text: 'measure me',
          maxWidth: '120px',
          minWidth: 0,
          lineHeight: '24px',
        });

        expect(appended).to.not.be.null;
        expect(appended!.style.maxWidth).to.equal('120px');
        expect(appended!.style.minWidth).to.equal('0px');
        expect(appended!.style.lineHeight).to.equal('24px');
        expect(size.width).to.be.greaterThan(0);
      });
    });

    it('should reuse the same measurement node', () => {
      cy.document().then((doc) => {
        const appendChild = doc.body.appendChild.bind(doc.body);
        let appendCount = 0;

        cy.stub(doc.body, 'appendChild').callsFake((node: Node) => {
          appendCount += 1;
          return appendChild(node);
        });

        const firstSize = measurer!.measure({
          text: 'first measure',
          maxWidth: 200,
        });
        const secondSize = measurer!.measure({
          text: 'second measure',
          maxWidth: 240,
        });

        expect(appendCount).to.equal(1);
        expect(firstSize.width).to.be.greaterThan(0);
        expect(secondSize.width).to.be.greaterThan(0);
      });
    });

    it('should reset optional size styles between measurements', () => {
      cy.document().then((doc) => {
        const appendChild = doc.body.appendChild.bind(doc.body);
        let measureNode: HTMLDivElement | null = null;

        cy.stub(doc.body, 'appendChild').callsFake((node: Node) => {
          measureNode = node as HTMLDivElement;
          return appendChild(node);
        });

        measurer!.measure({
          text: 'first measure',
          maxWidth: 120,
          minWidth: 20,
          lineHeight: '24px',
        });

        expect(measureNode).to.not.be.null;
        expect(measureNode!.style.maxWidth).to.equal('120px');
        expect(measureNode!.style.minWidth).to.equal('20px');
        expect(measureNode!.style.lineHeight).to.equal('24px');

        measurer!.measure({
          text: 'second measure',
        });

        expect(measureNode!.style.maxWidth).to.equal('');
        expect(measureNode!.style.minWidth).to.equal('');
        expect(measureNode!.style.lineHeight).to.equal('');
      });
    });

    it('should dispose the measurement node explicitly', () => {
      cy.document().then((doc) => {
        const appendChild = doc.body.appendChild.bind(doc.body);
        let appendCount = 0;
        let measureNode: HTMLDivElement | null = null;

        cy.stub(doc.body, 'appendChild').callsFake((node: Node) => {
          appendCount += 1;
          measureNode = node as HTMLDivElement;
          return appendChild(node);
        });

        measurer!.measure({
          text: 'first measure',
          maxWidth: 200,
        });

        expect(measureNode).to.not.be.null;
        expect(measureNode!.isConnected).to.be.true;

        measurer!.dispose();

        expect(measureNode!.isConnected).to.be.false;

        measurer = dom.createTextMeasurer();

        measurer!.measure({
          text: 'second measure',
          maxWidth: 240,
        });

        expect(appendCount).to.equal(2);
      });
    });
  });
});
