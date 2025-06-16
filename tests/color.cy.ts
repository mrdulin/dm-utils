import { hexToRGBA } from '../src/color';

describe('color', () => {
  describe('hexToRGBA', () => {
    it('should convert 6-digit hex to rgba with default alpha', () => {
      const result = hexToRGBA('#ff5733');
      expect(result).to.equal('rgba(255, 87, 51, 1)');
    });

    it('should convert 6-digit hex without # and custom alpha', () => {
      const result = hexToRGBA('ff5733', '0.5');
      expect(result).to.equal('rgba(255, 87, 51, 0.5)');
    });

    it('should expand 3-digit hex and apply alpha', () => {
      const result = hexToRGBA('abc', 0.75);
      expect(result).to.equal('rgba(170, 187, 204, 0.75)');
    });

    it('should handle alpha of 0', () => {
      const result = hexToRGBA('000', 0);
      expect(result).to.equal('rgba(0, 0, 0, 0)');
    });

    it('should format decimal alpha correctly', () => {
      const result = hexToRGBA('000', 0.3333);
      expect(result).to.equal('rgba(0, 0, 0, 0.33)');
    });

    it('should throw error for invalid hex characters', () => {
      expect(() => hexToRGBA('#ggg')).to.throw('Invalid hex character(s)');
    });

    it('should throw error for invalid hex length', () => {
      expect(() => hexToRGBA('ff')).to.throw('Hex must be 3 or 6 characters long');
    });

    it('should throw error if alpha is not a number', () => {
      expect(() => hexToRGBA('ffffff', 'two')).to.throw('Alpha must be a valid number');
    });

    it('should throw error if alpha is greater than 1', () => {
      expect(() => hexToRGBA('ffffff', 1.5)).to.throw('Alpha must be between 0 and 1');
    });

    it('should throw error if alpha is less than 0', () => {
      expect(() => hexToRGBA('ffffff', -0.1)).to.throw('Alpha must be between 0 and 1');
    });
  });
});
