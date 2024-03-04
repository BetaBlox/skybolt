import { HTTP_METHOD } from '@/common/custom-fetcher';
import { LOGIN } from '@/common/routes';
import { Notify } from '@/features/notification/notification.service';
import { useState } from 'react';
import { Form, useNavigate, useParams } from 'react-router-dom';

export default function PasswordResetPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [data, setData] = useState({
    password: '',
    passwordConfirmation: '',
  });

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');

    try {
      const url = '/api/password-reset/reset';
      const response = await fetch(url, {
        method: HTTP_METHOD.POST,
        body: JSON.stringify({
          token,
          password: data.password,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        Notify.success('Password saved! Please log in again');
        navigate(LOGIN);
      }
    } catch (error) {
      console.error(error);
      setError('Something is not working quite right');
    }
  };

  if (!token) return 'Error loading data';

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Update Your Password
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <Form className="space-y-6" onSubmit={submit}>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
              <label
                htmlFor="password-confirmation"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password Confirmation
              </label>
              <div className="mt-2">
                <input
                  id="password-confirmation"
                  name="password-confirmation"
                  type="password"
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                  value={data.passwordConfirmation}
                  onChange={(e) =>
                    setData({
                      ...data,
                      passwordConfirmation: e.currentTarget.value,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Reset Password
              </button>
            </div>

            {error ? <p className="text-center text-red-500">{error}</p> : null}
          </Form>
        </div>
      </div>
    </div>
  );
}
