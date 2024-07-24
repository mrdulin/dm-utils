import dayjs from 'dayjs';
import { fill } from '../../src/echarts';

describe('fill', () => {
  it('should fill data every 5 minutes, input is [9:23,9:32]', () => {
    const data = [
      { x: dayjs('2024-07-24 09:23').valueOf(), y: 1, other: 'o' },
      { x: dayjs('2024-07-24 09:32').valueOf(), y: 2, other: 'k' },
    ];
    // debugger
    const result = fill(data, 'x', 'y');
    expect(result).to.deep.equal([
      { x: dayjs('2024-07-24 09:23').valueOf(), y: 1, other: 'o' },
      { x: dayjs('2024-07-24 09:25').valueOf(), y: 1 },
      { x: dayjs('2024-07-24 09:30').valueOf(), y: 1 },
      { x: dayjs('2024-07-24 09:32').valueOf(), y: 2, other: 'k' },
    ]);
  });

  it('should fill data every 5 minutes, input is [9:23,9:27]', () => {
    const data = [
      { x: dayjs('2024-07-24 09:23').valueOf(), y: 1, other: 'a' },
      { x: dayjs('2024-07-24 09:27').valueOf(), y: 2, other: 'b' },
    ];
    const result = fill(data, 'x', 'y');
    expect(result).to.deep.equal([
      { x: dayjs('2024-07-24 09:23').valueOf(), y: 1, other: 'a' },
      { x: dayjs('2024-07-24 09:25').valueOf(), y: 1 },
      { x: dayjs('2024-07-24 09:27').valueOf(), y: 2, other: 'b' },
    ]);
  });

  it('should fill data every 5 minutes, input is [09:23,09:27,09:30,09:35]', () => {
    const data = [
      { x: dayjs('2024-07-24 09:23').valueOf(), y: 1, other: 'a' },
      { x: dayjs('2024-07-24 09:27').valueOf(), y: 2, other: 'b' },
      { x: dayjs('2024-07-24 09:30').valueOf(), y: 3, other: 'c' },
      { x: dayjs('2024-07-24 09:35').valueOf(), y: 4, other: 'd' },
    ];
    const result = fill(data, 'x', 'y');
    expect(result).to.deep.equal([
      { x: dayjs('2024-07-24 09:23').valueOf(), y: 1, other: 'a' },
      { x: dayjs('2024-07-24 09:25').valueOf(), y: 1 },
      { x: dayjs('2024-07-24 09:27').valueOf(), y: 2, other: 'b' },
      { x: dayjs('2024-07-24 09:30').valueOf(), y: 3, other: 'c' },
      { x: dayjs('2024-07-24 09:35').valueOf(), y: 4, other: 'd' },
    ]);
  });
});
