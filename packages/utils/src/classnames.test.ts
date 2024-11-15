import { classNames } from './classnames';

describe('classNames', () => {
  test.each([
    [['one', 'two', 'three'], 'one two three'],
    [[null], ''],
    [[''], ''],
    [[undefined], ''],
    [[true], 'true'],
    [[false], ''],
    [['one', 'two', 'three', null, undefined], 'one two three'],
    [
      [
        'one',
        'two',
        'three',
        null,
        undefined,
        true ? 'rounded' : '',
        false ? 'text-lg' : 'text-sm',
      ],
      'one two three rounded text-sm',
    ],
  ])('should convert %s to %s', (classes, expected) => {
    expect(classNames(...classes)).toEqual(expected);
  });
});
