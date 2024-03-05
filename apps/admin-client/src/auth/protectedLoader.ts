import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import AuthProvider from './AuthProvider';
import { LOGIN } from '@/common/routes';

export default async function protectedLoader({ request }: LoaderFunctionArgs) {
  // If the user is not logged in and tries to access `/protected`, we redirect
  // them to `/login` with a `from` parameter that allows login to redirect back
  // to this page upon successful authentication
  const isAuthenticated = await AuthProvider.isAuthenticatedAsync();
  const isAdmin = AuthProvider.user?.isAdmin === true;

  if (!isAuthenticated) {
    const params = new URLSearchParams();
    params.set('from', new URL(request.url).pathname);
    return redirect(`${LOGIN}?` + params.toString());
  }

  // A non user is trying to access protected data. Reject them and kick to login
  if (isAuthenticated && !isAdmin) {
    AuthProvider.signout();
    return redirect(LOGIN);
  }

  return null;
}
