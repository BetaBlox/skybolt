import {
  getAccessTokenFromStorage,
  refreshTokens,
  signout,
  tokenIsExpired,
} from '@repo/auth';
import { redirect } from 'react-router-dom';
import { HOME } from './routes';

export const ContentType = {
  JSON: 'application/json',
  FORM: 'application/x-www-form-urlencoded',
  MULTIPART_FORM: 'multipart/form-data',
  PDF: 'application/pdf',
};
export const ResponseType = {
  JSON: 'json',
  TEXT: 'text',
  BLOB: 'blob',
};

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

// Handles the actual request
const originalRequest = async (
  url: string,
  config: FetchConfig,
): Promise<CustomFetchResponse> => {
  const response = await fetch(url, config);

  if (response.ok) {
    // Handle response based on responseType
    let data;
    const responseType = config.responseType || ResponseType.JSON; // Default to 'json' if not provided
    if (responseType === ResponseType.BLOB) {
      data = await response.blob(); // Handle binary data like PDFs
    } else if (responseType === ResponseType.JSON) {
      data = await response.json(); // Default: handle JSON
    } else {
      data = await response.text(); // Fallback for text responses
    }

    return { response, data };
  } else {
    console.error('Error fetching data', response);
    return { response, data: null };
  }
};

export const customFetch = async (
  url: string,
  config: FetchConfig = {
    headers: {},
    responseType: ResponseType.JSON, // Default to 'json' but can be overridden
    method: HttpMethod.GET, // Default to 'GET' but can be overridden
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

    await refreshTokens();

    // grab the new access token from local storage after refresh is complete
    accessToken = getAccessTokenFromStorage();
  }

  const defaultHeaders = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': ContentType.JSON,
  };

  const headerOverrides = {
    ...(config.headers || {}),
  };

  config.headers = removeEmpty({
    ...defaultHeaders,
    ...headerOverrides,
  });

  // Hack to handle FormData defaultg in the browser
  if (config.headers['Content-Type'] === ContentType.MULTIPART_FORM) {
    delete config.headers['Content-Type']; // Remove Content-Type for FormData
  }

  console.debug(`fetching data - start [url: ${url}]`);
  const { response, data } = await originalRequest(url, config);
  console.debug(`fetching data - end [url: ${url}]`, response, data);
  return { response, data };
};

function removeEmpty(obj: object): object {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}
