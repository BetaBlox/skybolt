import { EncodedQuery, objectToSearchString } from 'serialize-query-params';

export function toSearchString(params: EncodedQuery) {
  return objectToSearchString(params);
}

export function routeWithParams(
  path: string | null | undefined,
  params: EncodedQuery = {},
) {
  if (!path) {
    return '';
  }

  // Assert that path is a string from this point forward
  let finalPath = path as string;

  const keys = Object.keys(params);

  keys.map((key) => {
    const pathKey = `:${key}`;
    const pathHasKey = finalPath.includes(pathKey);

    if (pathHasKey) {
      const value = params[key] as string;
      finalPath = finalPath.replace(`:${key}`, value);
      delete params[key];
    }
  });

  if (Object.keys(params).length > 0) {
    return `${finalPath}?${toSearchString(params)}`;
  } else {
    return finalPath;
  }
}
