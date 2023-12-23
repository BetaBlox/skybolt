/**
 * Converts a base object into a serialize filters object by removing empty values such as null and ""
 *
 * @param filters object
 * @returns
 */
export function objectToFilters(filters: object): object {
  const entries = Object.entries(filters);
  const filtered = entries.filter(([_, v]) => v != null && v != "");
  return Object.fromEntries(filtered);
}
