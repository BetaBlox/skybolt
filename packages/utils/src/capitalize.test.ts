import { captilalize } from './capitalize';

describe('captilalize', () => {
  test.each([
    ['', ''],
    [null, ''],
    [undefined, ''],
    ['lowercase', 'Lowercase'],
    ['Capitalized', 'Capitalized'],
    ['lowercase with space', 'Lowercase with space'],
    ['snake_case', 'Snake_case'],
    ['camelCase', 'Camel Case'],
  ])("should convert '%s' to '%s'", (value, expected) => {
    expect(captilalize(value)).toEqual(expected);
  });
});
