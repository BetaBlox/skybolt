import { User } from '@repo/database';
import { useState, FormEvent } from 'react';
import { AuthProvider, changePassword, updateUserProfile } from '@repo/auth';
import { Button } from '@/components/button';
import { useToast } from '@/components/toast/use-toast';
import { Label } from '@/components/label';
import { Input } from '@/components/input';

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
                <Label htmlFor="first-name">First name *</Label>
                <div className="mt-2">
                  <Input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    value={data.firstName || ''}
                    onChange={(e) =>
                      handleChange('firstName', e.currentTarget.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <Label htmlFor="last-name">Last name *</Label>
                <div className="mt-2">
                  <Input
                    type="text"
                    name="last-name"
                    id="last-name"
                    autoComplete="family-name"
                    value={data.lastName || ''}
                    onChange={(e) =>
                      handleChange('lastName', e.currentTarget.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <Label htmlFor="email">Email address *</Label>
                <div className="mt-2">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={data.email || ''}
                    onChange={(e) =>
                      handleChange('email', e.currentTarget.value)
                    }
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
                <Label htmlFor="new-password">New password</Label>
                <div className="mt-2">
                  <Input
                    type="password"
                    name="new-password"
                    id="new-password"
                    value={password || ''}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <Label htmlFor="confirm-password">Confirm your password</Label>
                <div className="mt-2">
                  <Input
                    type="password"
                    name="confirm-password"
                    id="confirm-password"
                    value={passwordConfirm || ''}
                    onChange={(e) => setPasswordConfirm(e.currentTarget.value)}
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
