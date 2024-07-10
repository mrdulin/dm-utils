import { trueTypeOf } from '../src/operator';

describe('operator', () => {
  describe('trueTypeOf', () => {
    it('should pass', () => {
      expect(trueTypeOf([])).to.be.equal('array');
      expect(trueTypeOf({})).to.be.equal('object');
      expect(trueTypeOf('')).to.be.equal('string');
      expect(trueTypeOf(new Date())).to.be.equal('date');
      expect(trueTypeOf(1)).to.be.equal('number');
      expect(trueTypeOf(function () {})).to.be.equal('function');
      expect(trueTypeOf(/test/i)).to.be.equal('regexp');
      expect(trueTypeOf(true)).to.be.equal('boolean');
      expect(trueTypeOf(null)).to.be.equal('null');
      expect(trueTypeOf(undefined)).to.be.equal('undefined');
      expect(trueTypeOf(new ArrayBuffer(8))).to.be.equal('arraybuffer');
    });
  });
});
