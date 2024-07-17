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

  describe('getYears', () => {
    it('should return recent years, the return type is number[]', () => {
      const getFullYearStub = cy.stub(Date.prototype, 'getFullYear').returns(2024);
      const actual = date.getYears({ recentYears: 5, type: date.YearOptionKind.Numbers });
      expect(actual).to.be.deep.equal([2024, 2023, 2022, 2021, 2020]);
      getFullYearStub.restore();
    });

    it('should return recent years, the return type is RecentYearOption[]', () => {
      const getFullYearStub = cy.stub(Date.prototype, 'getFullYear').returns(2024);
      const actual = date.getYears({ recentYears: 5, type: date.YearOptionKind.Objects });
      expect(actual).to.be.deep.equal([
        { value: 2024, label: '2024年' },
        { value: 2023, label: '2023年' },
        { value: 2022, label: '2022年' },
        { value: 2021, label: '2021年' },
        { value: 2020, label: '2020年' },
      ]);
      getFullYearStub.restore();
    });

    it('should return recent years from end years, the return type is number[]', () => {
      const actual = date.getYears({ recentYears: 3, type: date.YearOptionKind.Numbers, endYear: 2023 });
      expect(actual).to.be.deep.equal([2023, 2022, 2021]);
    });

    it('should return recent years from end years, the return type is RecentYearOption[]', () => {
      const actual = date.getYears({ recentYears: 3, type: date.YearOptionKind.Objects, endYear: 2023 });
      expect(actual).to.be.deep.equal([
        { value: 2023, label: '2023年' },
        { value: 2022, label: '2022年' },
        { value: 2021, label: '2021年' },
      ]);
    });

    it('should return recent years with suffix', () => {
      const actual = date.getYears({ recentYears: 3, type: date.YearOptionKind.Objects, endYear: 2023, suffix: 'year' });
      expect(actual).to.be.deep.equal([
        { value: 2023, label: '2023year' },
        { value: 2022, label: '2022year' },
        { value: 2021, label: '2021year' },
      ]);
    });

    it('should return years from start to now, the return type is number[]', () => {
      const getFullYearStub = cy.stub(Date.prototype, 'getFullYear').returns(2025);
      const actual = date.getYears({ startYear: 2021, type: date.YearOptionKind.Numbers });
      expect(actual).to.be.deep.equal([2025, 2024, 2023, 2022, 2021]);
      getFullYearStub.restore();
    });

    it('should return years from start to end, the return type is number[]', () => {
      const actual = date.getYears({ startYear: 2021, endYear: 2023, type: date.YearOptionKind.Numbers });
      expect(actual).to.be.deep.equal([2023, 2022, 2021]);
    });

    it('should return [] if start year is greater than current year', () => {
      const getFullYearStub = cy.stub(Date.prototype, 'getFullYear').returns(2024);
      const actual = date.getYears({ startYear: 2025, type: date.YearOptionKind.Numbers });
      expect(actual).to.be.deep.equal([]);
      getFullYearStub.restore();
    });

    it('should return [] if start year is greater than end year', () => {
      const actual = date.getYears({ startYear: 2025, endYear: 2024, type: date.YearOptionKind.Numbers });
      expect(actual).to.be.deep.equal([]);
    });

    it('should throw an error if type is unknown', () => {
      const type: any = 'unknownType';
      expect(() => date.getYears({ recentYears: 5, type })).to.throw('type must be enum: YearOptionKind.Numbers or YearOptionKind.Objects');
    });
  });

  describe('dayOfWeek', () => {
    it('should returns day of week', () => {
      expect(date.dayOfWeek(0)).to.be.equal('日');
      expect(date.dayOfWeek(1)).to.be.equal('一');
      expect(date.dayOfWeek(2)).to.be.equal('二');
      expect(date.dayOfWeek(3)).to.be.equal('三');
      expect(date.dayOfWeek(4)).to.be.equal('四');
      expect(date.dayOfWeek(5)).to.be.equal('五');
      expect(date.dayOfWeek(6)).to.be.equal('六');
    });

    it('should throw an error if num is not an integer', () => {
      expect(() => date.dayOfWeek(1.2)).to.throw('请输入一个整数');
    });
  });
});
