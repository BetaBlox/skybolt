import { Sort } from "./constants";

export function sortByLength(
  collection: Array<any>,
  key: string,
  order: string = Sort.Ascending,
) {
  const res = [...collection];

  res.sort(function (a, b) {
    const valueA = a[key] || [];
    const valueB = b[key] || [];
    const lengthA = valueA.length;
    const lengthB = valueB.length;

    // Compare the two
    if (lengthA < lengthB) {
      return order === Sort.Ascending ? -1 : 1;
    } else if (lengthA > lengthB) {
      return order === Sort.Ascending ? 1 : -1;
    } else {
      return 0;
    }
  });

  return res;
}
