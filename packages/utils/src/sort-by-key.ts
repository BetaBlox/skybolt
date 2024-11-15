import { Sort } from './constants';

export function sortByKey(
  collection: Array<any>,
  key: string,
  order: string = Sort.Ascending,
) {
  const res = [...collection];

  res.sort(function (a, b) {
    const valueA = a[key];
    const valueB = b[key];

    // Compare the two
    if (valueA < valueB) {
      return order === Sort.Ascending ? -1 : 1;
    } else if (valueA > valueB) {
      return order === Sort.Ascending ? 1 : -1;
    } else {
      return 0;
    }
  });

  return res;
}
