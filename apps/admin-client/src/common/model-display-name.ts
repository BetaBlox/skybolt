/**
 * @see https://stackoverflow.com/questions/7225407/convert-camelcasetext-to-title-case-text
 */
export function modelDisplayName(modelName: string): string {
  const text = modelName.replace(/([A-Z])/g, ' $1');
  return text.charAt(0).toUpperCase() + text.slice(1);
}
