import { User } from '@repo/database';
import { useState, FormEvent } from 'react';
import { AuthProvider, changePassword, updateUserProfile } from '@repo/auth';
import { Button } from '@/components/button';
import { useToast } from '@/components/toast/use-toast';

export default function UserProfilePage() {
  const [data, setData] = useState<User>(AuthProvider.user!);
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const savePersonalInfo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await updateUserProfile(data);
      toast({
        title: 'Profile saved.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
        variant: 'destructive',
      });
    }
  };

  const saveNewPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await changePassword(password);
      if (res.ok) {
        toast({
          title: 'Password udpated.',
        });
      } else {
        toast({
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
        variant: 'destructive',
      });
    }
  };

  const handleChange = (key: string, value: string) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  return (
    <div className="space-y-10 divide-y divide-gray-900/10">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Personal Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            You can manage your personal profile information here.
          </p>
        </div>

        <form
          className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
          onSubmit={savePersonalInfo}
        >
          <div className="px-4 py-6 sm:p-8">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  First name *
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    value={data.firstName || ''}
                    onChange={(e) =>
                      handleChange('firstName', e.currentTarget.value)
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Last name *
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    autoComplete="family-name"
                    value={data.lastName || ''}
                    onChange={(e) =>
                      handleChange('lastName', e.currentTarget.value)
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address *
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={data.email || ''}
                    onChange={(e) =>
                      handleChange('email', e.currentTarget.value)
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Change Password
          </h2>
        </div>

        <form
          className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
          onSubmit={saveNewPassword}
        >
          <div className="px-4 py-6 sm:p-8">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  New password
                </label>
                <div className="mt-2">
                  <input
                    type="password"
                    name="new-password"
                    id="new-password"
                    value={password || ''}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Confirm your password
                </label>
                <div className="mt-2">
                  <input
                    type="password"
                    name="confirm-password"
                    id="confirm-password"
                    value={passwordConfirm || ''}
                    onChange={(e) => setPasswordConfirm(e.currentTarget.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
