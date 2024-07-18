import { removeZeroValueKeys, ZeroValues } from '../src/object';

describe('removeZeroValueKeys', () => {
  it('should remove the keys which value is "zero" value with default "zero" value option', () => {
    const org = { a: '', b: 'abc', c: undefined, d: null, e: NaN, f: -1, g: [], h: {} };
    const result = removeZeroValueKeys(org);
    expect(result).to.deep.equal({ b: 'abc', f: -1 });
  });

  it('should remove the keys which value is "zero" value with custom "zero" value option', () => {
    expect(removeZeroValueKeys({ a: '', b: 'abc', c: undefined, d: null, e: NaN, f: -1, g: [], h: {} }, [...ZeroValues, -1])).to.deep.equal(
      {
        b: 'abc',
      },
    );
  });
});
