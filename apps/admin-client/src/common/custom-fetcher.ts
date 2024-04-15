import {
  getAccessTokenFromStorage,
  refreshTokens,
  signout,
  tokenIsExpired,
} from '@repo/auth';
import { redirect } from 'react-router-dom';
import { HOME } from './routes';

export const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

type CustomFetchResponse = {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  response: any;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  data: any;
};
type FetchConfig = {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  [key: string]: any;
};
const originalRequest = async (
  url: string,
  config: FetchConfig,
): Promise<CustomFetchResponse> => {
  const response = await fetch(url, config);
  const data = await response.json();
  return { response, data };
};

let refreshPromise: Promise<void> | null = null;
export const customFetch = async (
  url: string,
  config: FetchConfig = {
    headers: {},
  },
): Promise<CustomFetchResponse> => {
  if (!url) {
    throw new Error('Invalid fetch, no url provided');
  }

  let accessToken = getAccessTokenFromStorage();

  if (!accessToken) {
    console.log('Unable to find user access token');
    await signout();
    redirect(HOME);
    return { response: null, data: null };
  }

  if (tokenIsExpired(accessToken)) {
    console.warn('Access token is expired. Attempting to refresh token now.');

    // Make sure we only try to refresh once.
    // Even if a bunch of API requests fire off at once.
    refreshPromise = refreshPromise || refreshTokens();
    await refreshPromise;

    // grab the new access token from local storage after refresh is complete
    accessToken = getAccessTokenFromStorage();
  }

  const defaultHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
  const headerOverrides = {
    ...(config.headers || {}),
  };
  config.headers = removeEmpty({
    ...defaultHeaders,
    ...headerOverrides,
  });

  console.debug(`fetching data - start [url: ${url}]`);
  const { response, data } = await originalRequest(url, config);
  console.debug(`fetching data - end [url: ${url}]`, response, data);
  return { response, data };
};

function removeEmpty(obj: object): object {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}
