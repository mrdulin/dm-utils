/**
 * Generates an array of numbers representing a range of years between the start year and the end year.
 *
 * @param {number} start - the starting year of the range
 * @param {number} end - the ending year of the range (defaults to the current year)
 * @return {number[]} an array of numbers representing the range of years
 */
export const rangeOfYears = (start: number, end: number = new Date().getFullYear()): number[] =>
  Array(end - start + 1)
    .fill(start)
    .map((year, index) => year + index);
