import { HOME } from '@/common/routes';
import { isAuthenticatedAsync } from '@repo/auth';
import { redirect } from 'react-router-dom';

export default async function loginLoader() {
  const isAuthenticated = await isAuthenticatedAsync();

  if (isAuthenticated) {
    return redirect(HOME);
  }

  return null;
}
