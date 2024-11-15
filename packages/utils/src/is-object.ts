/**
 * @see https://stackoverflow.com/a/8511350
 */
export function isObject(value: any) {
  return typeof value === 'object' && !Array.isArray(value) && value !== null;
}
