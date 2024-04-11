import { HttpMethod } from '@/common/custom-fetcher';
import { LOGIN } from '@/common/routes';
import { Button } from '@/components/button';
import { Input } from '@/components/Input';
import { Label } from '@/components/label';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Form, Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const sendResetMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/password-reset/send', {
        method: HttpMethod.POST,
        body: JSON.stringify({
          email,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Something is not working quite right');
      }
    },
    onSuccess() {
      setMsg('Your reset email is on the way!');
    },
    onError(error) {
      console.error(error);
    },
  });

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg('');
    sendResetMutation.mutate();
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-10 w-auto"
          src="https://cdn-icons-png.flaticon.com/512/906/906343.png"
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
              <Label htmlFor="email">Email</Label>
              <div className="mt-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={sendResetMutation.isPending}
                className="w-full"
              >
                {sendResetMutation.isPending ? 'Sending...' : 'Send'}
              </Button>
            </div>

            {msg ? <p className="text-center text-green-500">{msg}</p> : null}
            {sendResetMutation.error ? (
              <p className="text-center text-red-500">
                {sendResetMutation.error.message}
              </p>
            ) : null}
          </Form>
          <div className="mt-6 text-center text-sm text-gray-600">
            <Link to={LOGIN}>Back to login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
