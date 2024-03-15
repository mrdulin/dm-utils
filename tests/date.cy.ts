import { date } from '../src';

describe('date', () => {
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
