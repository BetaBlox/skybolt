import { HTTP_METHOD } from '@/common/custom-fetcher';
import { LOGIN } from '@/common/routes';
import { useState } from 'react';
import { Form, Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMsg('');
    setError('');
    setIsFetching(true);

    try {
      const url = '/api/password-reset/send';
      const response = await fetch(url, {
        method: HTTP_METHOD.POST,
        body: JSON.stringify({
          email,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setMsg('Your reset email is on the way!');
      } else {
        setError('Something is not working quite right');
      }
    } catch (error) {
      console.error(error);
      setError('Something is not working quite right');
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Send Password Reset Instructions
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <Form className="space-y-6" onSubmit={submit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={isFetching}
              >
                {isFetching ? 'Logging in...' : 'Login'}
              </button>
            </div>

            {msg ? <p className="text-center text-green-500">{msg}</p> : null}
            {error ? <p className="text-center text-red-500">{error}</p> : null}
          </Form>
          <div className="mt-6 text-center text-sm text-gray-600">
            <Link to={LOGIN}>Back to login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
