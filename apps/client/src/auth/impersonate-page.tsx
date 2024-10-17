import { useState, useEffect } from 'react';
import { impersonate } from '@repo/auth';
import { useSearchParams } from 'react-router-dom';
import { ImpersonateApi } from '@/auth/impersonation-api';
import { routeWithParams } from '@repo/utils';
import { LOGIN } from '@/common/routes';

export default function ImpersonatePage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('Impersonating user...');

  useEffect(() => {
    const exchangeToken = async () => {
      const token = searchParams.get('token');
      if (!token) {
        window.location.href = routeWithParams(LOGIN, {
          error: 'invalid_token',
        });
        return;
      }

      try {
        const { accessToken, refreshToken } =
          await ImpersonateApi.exchangeToken(token);

        setStatus('Impersonation successful');
        await impersonate(accessToken, refreshToken);

        setStatus('Redirecting to app home...');

        window.location.href = '/';
      } catch (error) {
        console.error('Impersonation token exchange error:', error);
        setStatus('Impersonation failed. Redirecting to login...');
        window.location.href = routeWithParams(LOGIN, {
          error: 'impersonation_failed',
        });
      }
    };

    exchangeToken();
  }, [searchParams]);

  return <p>{status}</p>;
}
