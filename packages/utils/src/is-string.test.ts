import { isString } from "./is-string";

describe("isString", () => {
  test.each([
    [{}, false],
    [{ a: 1, b: 2 }, false],
    [[], false],
    [1, false],
    [false, false],
    [true, false],
    [null, false],
    [undefined, false],
    ["", true],
    ["string", true],
  ])("should verify if %s is a string", (value, expected) => {
    expect(isString(value)).toEqual(expected);
  });
});
