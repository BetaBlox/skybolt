import { isObject } from './is-object';

describe('isObject', () => {
  test.each([
    [{}, true],
    [{ a: 1, b: 2 }, true],
    [[], false],
    [1, false],
    [false, false],
    [true, false],
    [null, false],
    [undefined, false],
    ['string', false],
  ])('should verify if %s is an object', (value, expected) => {
    expect(isObject(value)).toEqual(expected);
  });
});
