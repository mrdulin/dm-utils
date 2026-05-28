import { hasSameSelectionValues, toggleSelectionValue } from '../../src/scene';

describe('scene/toggleSelectionValue', () => {
  const defaultValue = 'all';
  const isDefaultSelected = (value: string[] | undefined) => hasSameSelectionValues(value, [defaultValue]);

  describe('toggleSelectionValue', () => {
    it('should fallback to default value when selected values are undefined and default value is toggled', () => {
      const result = toggleSelectionValue({
        selectedValues: undefined,
        toggledValue: defaultValue,
        selected: true,
        defaultValue,
        isDefaultSelected,
      });

      expect(result).to.deep.equal([defaultValue]);
    });

    it('should keep current values when default value is already selected', () => {
      const result = toggleSelectionValue({
        selectedValues: [defaultValue],
        toggledValue: defaultValue,
        selected: true,
        defaultValue,
        isDefaultSelected,
      });

      expect(result).to.deep.equal([defaultValue]);
    });

    it('should replace default value when selecting a non-default value from default state', () => {
      const result = toggleSelectionValue({
        selectedValues: [defaultValue],
        toggledValue: 'A',
        selected: true,
        defaultValue,
        isDefaultSelected,
      });

      expect(result).to.deep.equal(['A']);
    });

    it('should append a non-default value when selecting from a custom selection', () => {
      const result = toggleSelectionValue({
        selectedValues: ['A'],
        toggledValue: 'B',
        selected: true,
        defaultValue,
        isDefaultSelected,
      });

      expect(result).to.deep.equal(['A', 'B']);
    });

    it('should not duplicate an existing non-default value', () => {
      const result = toggleSelectionValue({
        selectedValues: ['A', 'B'],
        toggledValue: 'B',
        selected: true,
        defaultValue,
        isDefaultSelected,
      });

      expect(result).to.deep.equal(['A', 'B']);
    });

    it('should keep current values when deselecting a value that is not selected', () => {
      const result = toggleSelectionValue({
        selectedValues: ['A', 'B'],
        toggledValue: 'C',
        selected: false,
        defaultValue,
        isDefaultSelected,
      });

      expect(result).to.deep.equal(['A', 'B']);
    });

    it('should remove a deselected non-default value when other values remain selected', () => {
      const result = toggleSelectionValue({
        selectedValues: ['A', 'B'],
        toggledValue: 'B',
        selected: false,
        defaultValue,
        isDefaultSelected,
      });

      expect(result).to.deep.equal(['A']);
    });

    it('should fallback to default value when deselecting the last non-default value', () => {
      const result = toggleSelectionValue({
        selectedValues: ['A'],
        toggledValue: 'A',
        selected: false,
        defaultValue,
        isDefaultSelected,
      });

      expect(result).to.deep.equal([defaultValue]);
    });
  });

  describe('hasSameSelectionValues', () => {
    it('should treat undefined and empty array as the same selection', () => {
      expect(hasSameSelectionValues(undefined, [])).to.be.true;
    });

    it('should return true for arrays with the same values and order', () => {
      expect(hasSameSelectionValues(['A', 'B'], ['A', 'B'])).to.be.true;
    });

    it('should return false for arrays with different order', () => {
      expect(hasSameSelectionValues(['A', 'B'], ['B', 'A'])).to.be.false;
    });
  });
});
