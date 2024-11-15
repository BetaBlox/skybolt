/**
 * @see https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
 */
export function camelize(text: string | null | undefined) {
  if (!text) {
    return '';
  }

  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
}
