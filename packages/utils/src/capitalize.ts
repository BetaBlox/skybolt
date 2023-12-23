export function captilalize(text: string | null | undefined) {
  if (!text) {
    return "";
  }

  if (text.charAt(0).match(/[A-Z]/)) {
    return text;
  }

  const result = text.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}
