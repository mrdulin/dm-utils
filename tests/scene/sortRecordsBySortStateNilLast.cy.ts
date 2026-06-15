import { sortRecordsBySortStateNilLast, VirtualTableSortDirection } from '../../src/scene';

describe('scene/sortRecordsBySortStateNilLast', () => {
  it('should return original records when sort state is undefined', () => {
    const records = [{ value: 2 }, { value: 1 }];

    const result = sortRecordsBySortStateNilLast(records, undefined);

    expect(result).to.equal(records);
  });

  it('should return original records when sort direction is none', () => {
    const records = [{ value: 2 }, { value: 1 }];

    const result = sortRecordsBySortStateNilLast(records, { field: 'value', direction: VirtualTableSortDirection.NONE });

    expect(result).to.equal(records);
  });

  it('should return undefined when records are undefined', () => {
    const result = sortRecordsBySortStateNilLast(undefined, { field: 'value', direction: VirtualTableSortDirection.ASC });

    expect(result).to.be.undefined;
  });

  it('should sort ascending and place nil values at the end', () => {
    const records = [{ value: 3 }, { value: undefined }, { value: 1 }, { value: null }, { value: 2 }];

    const result = sortRecordsBySortStateNilLast(records, { field: 'value', direction: VirtualTableSortDirection.ASC });

    expect(result).to.deep.equal([{ value: 1 }, { value: 2 }, { value: 3 }, { value: undefined }, { value: null }]);
  });

  it('should sort descending and place nil values at the end', () => {
    const records = [{ value: 3 }, { value: undefined }, { value: 1 }, { value: null }, { value: 2 }];

    const result = sortRecordsBySortStateNilLast(records, { field: 'value', direction: VirtualTableSortDirection.DESC });

    expect(result).to.deep.equal([{ value: 3 }, { value: 2 }, { value: 1 }, { value: undefined }, { value: null }]);
  });

  it('should support custom sort value extraction', () => {
    const records = [
      { id: 1, metrics: { score: 20 } },
      { id: 2, metrics: undefined },
      { id: 3, metrics: { score: 10 } },
    ];

    const result = sortRecordsBySortStateNilLast(
      records,
      { field: 'metrics', direction: VirtualTableSortDirection.ASC },
      {
        getSortValue(record) {
          return record.metrics?.score;
        },
      },
    );

    expect(result).to.deep.equal([
      { id: 3, metrics: { score: 10 } },
      { id: 1, metrics: { score: 20 } },
      { id: 2, metrics: undefined },
    ]);
  });
});
