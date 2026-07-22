import React, { useLayoutEffect, useRef, useState } from 'react';
import symbols from '../../src/echarts/symbols';

const pathPrefix = 'path://';
const imagePrefix = 'image://';
const symbolEntries = Object.keys(symbols).map((name) => [name, symbols[name as keyof typeof symbols]] as const);

const previewStyle: React.CSSProperties = {
  boxSizing: 'border-box',
  width: '960px',
  minHeight: '100vh',
  padding: '32px',
  background: '#ffffff',
  color: '#222b38',
  fontFamily: 'Arial, sans-serif',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '16px',
};

const cardStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '96px minmax(0, 1fr)',
  alignItems: 'center',
  height: '132px',
  padding: '16px',
  border: '1px solid #d9d9d9',
  borderRadius: '4px',
  boxSizing: 'border-box',
};

const iconStyle: React.CSSProperties = {
  display: 'grid',
  width: '72px',
  height: '72px',
  placeItems: 'center',
};

function PathIcon({ value }: { value: string }) {
  const pathRef = useRef<SVGPathElement>(null);
  const [viewBox, setViewBox] = useState('0 0 1 1');

  useLayoutEffect(() => {
    const box = pathRef.current?.getBBox();
    if (box && box.width > 0 && box.height > 0) {
      const padding = Math.max(box.width, box.height) * 0.1;
      setViewBox(`${box.x - padding} ${box.y - padding} ${box.width + padding * 2} ${box.height + padding * 2}`);
    }
  }, [value]);

  return (
    <svg aria-hidden="true" viewBox={viewBox} width="72" height="72">
      <path ref={pathRef} d={value.slice(pathPrefix.length)} fill="#1677ff" />
    </svg>
  );
}

function SymbolPreview() {
  if (symbolEntries.length === 0) {
    throw new Error('symbols 中没有可生成预览的图标');
  }

  return (
    <main data-cy="echarts-symbols-preview" style={previewStyle}>
      <h1 style={{ margin: '0 0 24px', fontSize: '24px' }}>ECharts Symbols</h1>
      <div data-cy="symbol-grid" style={gridStyle}>
        {symbolEntries.map(([name, value]) => (
          <section data-cy="symbol-card" key={name} style={cardStyle}>
            <div data-cy="symbol-icon" style={iconStyle}>
              {value.startsWith(pathPrefix) ? (
                <PathIcon value={value} />
              ) : value.startsWith(imagePrefix) ? (
                <img
                  src={value.slice(imagePrefix.length)}
                  alt=""
                  width="72"
                  height="72"
                  style={{ display: 'block', objectFit: 'contain' }}
                />
              ) : (
                (() => {
                  throw new Error(`${name} 的图标格式不受支持`);
                })()
              )}
            </div>
            <code style={{ overflowWrap: 'anywhere', fontSize: '14px' }}>{name}</code>
          </section>
        ))}
      </div>
    </main>
  );
}

describe('ECharts 图标预览', () => {
  it('渲染 symbols 中的全部图标', () => {
    const pathCount = symbolEntries.filter(([, value]) => value.startsWith(pathPrefix)).length;
    const imageCount = symbolEntries.filter(([, value]) => value.startsWith(imagePrefix)).length;

    cy.mount(<SymbolPreview />);

    cy.get('[data-cy=symbol-card]').should('have.length', symbolEntries.length);
    if (pathCount > 0) {
      cy.get('[data-cy=symbol-card] svg path').should(($paths) => {
        expect($paths).to.have.length(pathCount);
        $paths.each((_, path) => {
          const box = path.getBBox();
          expect(box.width).to.be.greaterThan(0);
          expect(box.height).to.be.greaterThan(0);
        });
      });
    }
    if (imageCount > 0) {
      cy.get('[data-cy=symbol-card] img').should(($images) => {
        expect($images).to.have.length(imageCount);
        $images.each((_, image) => {
          expect(image.complete).to.equal(true);
          expect(image.naturalWidth).to.be.greaterThan(0);
        });
      });
    }
    if (Cypress.env('generateSymbolsPreview')) {
      cy.screenshot('echarts-symbols-preview', { capture: 'fullPage' });
    }
  });
});
