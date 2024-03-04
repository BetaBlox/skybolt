import { redirect } from 'react-router-dom';
import AuthProvider from './AuthProvider';

export default async function loginLoader() {
  const isAuthenticated = await AuthProvider.isAuthenticatedAsync();

  if (isAuthenticated) {
    return redirect('/');
  }

  return null;
}
