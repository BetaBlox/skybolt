import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import { LOGIN } from '@/common/routes';
import { AuthProvider, isAuthenticatedAsync, signout } from '@repo/auth';

export default async function protectedLoader({ request }: LoaderFunctionArgs) {
  // If the user is not logged in and tries to access `/protected`, we redirect
  // them to `/login` with a `from` parameter that allows login to redirect back
  // to this page upon successful authentication
  const isAuthenticated = await isAuthenticatedAsync();
  const isAdmin = AuthProvider.user?.isAdmin === true;

  if (!isAuthenticated) {
    const params = new URLSearchParams();
    params.set('from', new URL(request.url).pathname);
    return redirect(`${LOGIN}?` + params.toString());
  }

  // A non user is trying to access protected data. Reject them and kick to login
  if (isAuthenticated && !isAdmin) {
    signout();
    return redirect(LOGIN);
  }

  return null;
}
