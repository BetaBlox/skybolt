import { useState, useEffect } from 'react';
import { impersonate } from '@repo/auth';

export default function ImpersonatePage() {
  const [status, setStatus] = useState('Impersonating user...');

  useEffect(() => {
    const exchangeToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (!token) {
        window.location.href = '/login?error=invalid_token';
        return;
      }

      try {
        const response = await fetch('/api/auth/exchange-impersonation-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error('Failed to exchange impersonation token');
        }

        const { accessToken, refreshToken } = await response.json();
        setStatus('Impersonation successful');
        await impersonate(accessToken, refreshToken);

        setStatus('Redirecting to app home...');

        window.location.href = '/';
      } catch (error) {
        console.error('Impersonation token exchange error:', error);
        setStatus('Impersonation failed. Redirecting to login...');
        window.location.href = '/login?error=impersonation_failed';
      }
    };

    exchangeToken();
  }, []);

  return <p>{status}</p>;
}
