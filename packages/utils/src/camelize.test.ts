import { camelize } from './camelize';

describe('camelize', () => {
  test.each([
    ['', ''],
    [null, ''],
    [undefined, ''],
    ['lowercase', 'lowercase'],
    ['Capitalized', 'capitalized'],
    ['lowercase with space', 'lowercaseWithSpace'],
    ['snake_case', 'snake_case'],
    ['camelCase', 'camelCase'],
  ])("should convert '%s' to '%s'", (value, expected) => {
    expect(camelize(value)).toEqual(expected);
  });
});
