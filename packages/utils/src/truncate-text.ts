export function truncateText(str: string, n: number = 20) {
  return str.length > n ? str.slice(0, n - 1) + '...' : str;
}
