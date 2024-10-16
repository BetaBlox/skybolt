import { LOGOUT } from '@/common/routes';
import { AuthProvider } from '@repo/auth';
import { Link } from 'react-router-dom';

export function ImpersonationBanner() {
  const isImpersonated = AuthProvider.isImpersonated;

  if (!isImpersonated) {
    return null;
  }

  return (
    <div
      className="flex w-full items-center gap-x-8 bg-yellow-200 px-4 py-2 text-yellow-700 md:justify-center"
      role="alert"
    >
      <div>
        You are logged in as:{' '}
        <span className="font-bold">{AuthProvider.email}</span>
      </div>
      <Link to={LOGOUT} className="underline hover:text-yellow-900">
        Logout
      </Link>
    </div>
  );
}
