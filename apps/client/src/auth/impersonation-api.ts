import { HttpMethod } from '@/common/custom-fetcher';

export const ImpersonateApi = {
  exchangeToken: async (
    token: string,
  ): Promise<{ accessToken: string; refreshToken: string }> => {
    const response = await fetch('/api/auth/exchange-impersonation-token', {
      method: HttpMethod.POST,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange impersonation token');
    }

    const { accessToken, refreshToken } = await response.json();
    return { accessToken, refreshToken };
  },
};
