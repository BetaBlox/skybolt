import { EncodedQuery, objectToSearchString } from "serialize-query-params";

export function toSearchString(params: EncodedQuery) {
  return objectToSearchString(params);
}

export function routeWithParams(path: string, params: EncodedQuery = {}) {
  if (!path) {
    return "";
  }

  const keys = Object.keys(params);

  keys.map((key) => {
    const pathKey = `:${key}`;
    const pathHasKey = path.includes(pathKey);

    if (pathHasKey) {
      const value = params[key] as string;
      path = path.replace(`:${key}`, value);
      delete params[key];
    }
  });

  if (Object.keys(params).length > 0) {
    return `${path}?${toSearchString(params)}`;
  } else {
    return path;
  }
}
