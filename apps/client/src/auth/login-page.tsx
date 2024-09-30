import { FORGOT_PASSWORD } from '@/common/routes';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { useState } from 'react';
import {
  useLocation,
  useNavigation,
  useActionData,
  Form,
  Link,
} from 'react-router-dom';

function Login() {
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const from = params.get('from') || '/';

  const navigation = useNavigation();
  const isLoggingIn = navigation.formData?.get('email') != null;

  const actionData = useActionData() as { error: string } | undefined;

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-20 w-auto rounded-full"
          src="/logo.webp"
          alt="Your Company"
        />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <Form method="post" className="space-y-6" replace>
            <input type="hidden" name="redirectTo" value={from} />

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="mt-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={data.email}
                  onChange={(e) =>
                    setData({
                      ...data,
                      email: e.currentTarget.value,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="mt-2">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={data.password}
                  onChange={(e) =>
                    setData({
                      ...data,
                      password: e.currentTarget.value,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </Button>
            </div>

            {actionData && actionData.error ? (
              <p className="text-center text-red-500">{actionData.error}</p>
            ) : null}
          </Form>
          <div className="mt-6 text-center text-sm text-gray-600">
            <Link to={FORGOT_PASSWORD}>Forgot password? Click here.</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
