import { date } from '../src';

describe('date', () => {
  describe('rangeOfYears', () => {
    it('should return range of years between start year and end year', () => {
      const actual = date.rangeOfYears(2019, 2023);
      expect(actual).to.be.deep.equal([2019, 2020, 2021, 2022, 2023]);
    });

    it('should return range of years from start to now', () => {
      const getFullYearStub = cy.stub(Date.prototype, 'getFullYear').returns(2025);
      const actual = date.rangeOfYears(2019);
      expect(actual).to.be.deep.equal([2019, 2020, 2021, 2022, 2023, 2024, 2025]);
      getFullYearStub.restore();
    });
  });

  describe('getRecentYears', () => {
    it('should return recent years, the return type is number[]', () => {
      const actual = date.getRecentYears(5, 'number[]');
      expect(actual).to.be.deep.equal([2024, 2023, 2022, 2021, 2020]);
    });

    it('should return recent years, the return type is RecentYearOption[]', () => {
      const actual = date.getRecentYears(5, 'object[]');
      expect(actual).to.be.deep.equal([
        { value: 2024, label: '2024年' },
        { value: 2023, label: '2023年' },
        { value: 2022, label: '2022年' },
        { value: 2021, label: '2021年' },
        { value: 2020, label: '2020年' },
      ]);
    });

    it('should throw an error if type is unknown', () => {
      const type: any = 'unknownType';
      expect(() => date.getRecentYears(5, type)).to.throw('type must be "number[]" or "object[]"');
    });
  });
});
