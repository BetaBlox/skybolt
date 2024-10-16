/**
 * Creates a local Date object from a given date string.
 *
 * This function takes a date string in the format 'YYYY-MM-DD' and:
 * 1. Parses it to create a Date object in UTC (assuming the input date does not have a time component).
 * 2. Converts the UTC date to a local date string based on the user's timezone.
 * 3. Returns a new Date object that represents the same date in the user's local timezone.
 *
 * This is useful when dealing with dates that need to be displayed or processed in a user's local time,
 * avoiding issues with UTC offsets that could result in incorrect date representations (e.g., shifting a date by one day).
 *
 * @param {string} dateString - The date string in the format 'YYYY-MM-DD'.
 * @returns {Date} - A Date object representing the local date in the user's timezone.
 */
export function createLocalDate(dateString: string): Date {
  const utcDate = new Date(dateString + 'T00:00:00Z');

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
  };
  const localDateString = utcDate.toLocaleString('en-US', options);

  return new Date(localDateString);
}
