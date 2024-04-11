import { HttpMethod } from '@/common/custom-fetcher';
import { LOGIN } from '@/common/routes';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { useToast } from '@/components/toast/use-toast';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Form, useNavigate, useParams } from 'react-router-dom';

export default function PasswordResetPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [data, setData] = useState({
    password: '',
    passwordConfirmation: '',
  });

  const resetMutation = useMutation({
    mutationKey: ['reset-password'],
    mutationFn: async () => {
      const response = await fetch('/api/password-reset/reset', {
        method: HttpMethod.POST,
        body: JSON.stringify({
          token,
          password: data.password,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Something is not working quite right');
      }
    },
    onSuccess: () => {
      toast({
        title: 'Password saved!',
        description: 'Please login to reauthenticate your account',
      });
      navigate(LOGIN);
    },
  });

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetMutation.mutate();
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
              <Label
                htmlFor="password-confirmation"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password Confirmation
              </Label>
              <div className="mt-2">
                <Input
                  id="password-confirmation"
                  name="password-confirmation"
                  type="password"
                  autoComplete="current-password"
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
              <Button
                type="submit"
                className="w-full"
                disabled={resetMutation.isPending}
              >
                {resetMutation.isPending ? '...' : 'Reset Password'}
              </Button>
            </div>

            {resetMutation.error ? (
              <p className="text-center text-red-500">
                {resetMutation.error.message}
              </p>
            ) : null}
          </Form>
        </div>
      </div>
    </div>
  );
}
