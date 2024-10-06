import {
  ContentType,
  customFetch,
  HttpMethod,
  ResponseType,
} from '@/common/custom-fetcher';
import {
  tokenIsExpired,
  refreshTokens,
  // signout
} from '@repo/auth';
import { redirect } from 'react-router-dom';

jest.mock('@repo/auth', () => ({
  signout: jest.fn(),
  getAccessTokenFromStorage: jest.fn(() => 'mocked-access-token'),
  tokenIsExpired: jest.fn(() => false),
  refreshTokens: jest.fn(() =>
    Promise.resolve({ accessToken: 'new-mocked-token' }),
  ),
}));

jest.mock('react-router-dom', () => ({
  redirect: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks(); // Clear all mocks before each test
});

// Simulate a successful fetch response with sample JSON data
function mockSuccessfulResponse() {
  // Simulate a successful fetch response with sample JSON data
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: 'Success' }),
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
    } as Response),
  );
}

describe('customFetch function', () => {
  describe('Basic validation', () => {
    it('should throw an error if no URL is provided', async () => {
      await expect(customFetch('')).rejects.toThrow(
        'Invalid fetch, no url provided',
      );
    });
  });

  describe('Default values', () => {
    it('should default method (GET), Content-Type (application/json), and responseType (json)', async () => {
      const url = 'https://example.com/api/defaults';
      mockSuccessfulResponse();

      const { data } = await customFetch(url);

      expect(data).toEqual({ message: 'Success' });
      expect(global.fetch).toHaveBeenCalledWith(
        url,
        expect.objectContaining({
          method: HttpMethod.GET, // Default method
          headers: expect.objectContaining({
            'Content-Type': 'application/json', // Default Content-Type
            Authorization: 'Bearer mocked-access-token', // Authorization header
          }),
        }),
      );
    });
  });

  describe('Successful response scenarios', () => {
    it('should return JSON data when responseType is JSON', async () => {
      const url = 'https://example.com/api/data';
      mockSuccessfulResponse();

      const { data } = await customFetch(url, {
        method: HttpMethod.GET,
        responseType: ResponseType.JSON, // We want to test JSON response
      });

      expect(data).toEqual({ message: 'Success' });
      expect(redirect).not.toHaveBeenCalled(); // Ensure no redirection happens during the test
      expect(tokenIsExpired).toHaveBeenCalledWith('mocked-access-token'); // Ensure tokenIsExpired was called
    });

    it('should return blob data when responseType is BLOB', async () => {
      const url = 'https://example.com/api/blob';

      // Mock fetch function to return a response with blob method
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          blob: () =>
            Promise.resolve(
              new Blob(['sample data'], { type: ContentType.PDF }),
            ), // Mock blob response
          status: 200,
          statusText: 'OK',
          headers: new Headers(),
        } as Response),
      );

      // Call customFetch with BLOB responseType
      const { data } = await customFetch(url, {
        method: HttpMethod.GET,
        responseType: ResponseType.BLOB, // We want to test BLOB response
      });

      // Check if the returned data is a Blob instance
      expect(data).toBeInstanceOf(Blob);
      expect(data.type).toBe(ContentType.PDF); // Check the blob type
      expect(global.fetch).toHaveBeenCalledWith(
        url,
        expect.objectContaining({
          method: HttpMethod.GET,
        }),
      );
    });
  });

  describe('Token expiration scenarios', () => {
    it('should refresh token if it is expired', async () => {
      const url = 'https://example.com/api/data';

      // Simulate token expired
      (tokenIsExpired as jest.Mock).mockReturnValueOnce(true);

      mockSuccessfulResponse();

      const { data } = await customFetch(url, {
        method: HttpMethod.GET,
        responseType: ResponseType.JSON,
      });

      // Verify token handling and response data
      expect(tokenIsExpired).toHaveBeenCalledWith('mocked-access-token');
      expect(refreshTokens).toHaveBeenCalled(); // Ensure refreshTokens is called
      expect(data).toEqual({ message: 'Success' }); // Check if the expected data is returned
    });

    it('should handle failure when refreshTokens fails', async () => {
      const url = 'https://example.com/api/data';
      (tokenIsExpired as jest.Mock).mockReturnValueOnce(true); // Simulate token expiration
      (refreshTokens as jest.Mock).mockRejectedValueOnce(
        new Error('Token refresh failed'),
      );

      await expect(
        customFetch(url, {
          method: HttpMethod.GET,
          responseType: ResponseType.JSON,
        }),
      ).rejects.toThrow('Token refresh failed');
    });
  });

  describe('Failed request scenarios', () => {
    it('should handle failed fetch requests', async () => {
      const url = 'https://example.com/api/fail';
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
        } as Response),
      );

      const { response, data } = await customFetch(url, {
        method: HttpMethod.GET,
        responseType: ResponseType.JSON,
      });

      expect(response.ok).toBe(false);
      expect(data).toBeNull();
    });

    // it('should handle unauthorized response and signout user', async () => {
    //   const url = 'https://example.com/api/unauthorized';
    //   global.fetch = jest.fn(() =>
    //     Promise.resolve({
    //       ok: false,
    //       status: 401,
    //       statusText: 'Unauthorized',
    //     } as Response),
    //   );

    //   const { response } = await customFetch(url, {
    //     method: HttpMethod.GET,
    //     responseType: ResponseType.JSON,
    //   });

    //   expect(response.status).toBe(401);
    //   expect(redirect).toHaveBeenCalledWith('/login');
    //   expect(signout).toHaveBeenCalled();
    // });
  });

  describe('Handling different HTTP methods', () => {
    it('should handle POST requests', async () => {
      const url = 'https://example.com/api/data';
      mockSuccessfulResponse();

      const { data } = await customFetch(url, {
        method: HttpMethod.POST,
        responseType: ResponseType.JSON,
        body: JSON.stringify({ key: 'value' }),
      });

      expect(data).toEqual({ message: 'Success' });
      expect(global.fetch).toHaveBeenCalledWith(
        url,
        expect.objectContaining({
          method: HttpMethod.POST,
          body: JSON.stringify({ key: 'value' }),
        }),
      );
    });

    it('should handle PUT requests', async () => {
      const url = 'https://example.com/api/data';
      mockSuccessfulResponse();

      const { data } = await customFetch(url, {
        method: HttpMethod.PUT,
        responseType: ResponseType.JSON,
        body: JSON.stringify({ key: 'value' }),
      });

      expect(data).toEqual({ message: 'Success' });
      expect(global.fetch).toHaveBeenCalledWith(
        url,
        expect.objectContaining({
          method: HttpMethod.PUT,
          body: JSON.stringify({ key: 'value' }),
        }),
      );
    });

    it('should handle DELETE requests', async () => {
      const url = 'https://example.com/api/delete';
      mockSuccessfulResponse();

      // Make the DELETE request using customFetch
      const { data } = await customFetch(url, {
        method: HttpMethod.DELETE, // Testing DELETE method
      });

      expect(data).toEqual({ message: 'Success' }); // Ensure the response data is correct
      expect(global.fetch).toHaveBeenCalledWith(
        url,
        expect.objectContaining({
          method: HttpMethod.DELETE,
        }),
      );
    });
  });

  describe('Content-Type header management', () => {
    it('should use the correct default Content-Type header', async () => {
      const url = 'https://example.com/api/default-content-type';
      mockSuccessfulResponse();

      // Make the custom fetch call
      const { data } = await customFetch(url);

      expect(data).toEqual({ message: 'Success' });
      expect(global.fetch).toHaveBeenCalledWith(
        url,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': ContentType.JSON,
          }),
        }),
      );
    });
  });
});
