import { Button } from '@/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/card';
import { Input } from '@/components/input';
import { Dashboard } from '@repo/admin-config';
import { User } from '@repo/database';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { customFetch, HttpMethod } from '@/common/custom-fetcher';
import { routeWithParams } from '@repo/utils';
import { useToast } from '@/components/toast/use-toast';
import { Spinner } from '@/components/spinner';

interface Props {
  dashboard: Dashboard<User>;
  modelName: string;
  record: User;
}
export const UpdatePasswordCard = ({ record }: Props) => {
  const [newPassword, setNewPassword] = useState('');
  const { toast } = useToast();

  const mutation = useMutation({
    mutationKey: ['update-password', record.id],
    mutationFn: async (password: string) => {
      const url = routeWithParams(`/api/users/:id/change-password`, {
        id: String(record.id),
      });
      const { response, data } = await customFetch(url, {
        method: HttpMethod.PUT,
        body: JSON.stringify({ newPassword: password }),
      });

      if (!response.ok) {
        throw new Error('Failed to update password');
      }

      return data;
    },
    onSuccess: () => {
      setNewPassword(''); // Reset the input field
      toast({
        title: 'Password updated successfully',
        description: 'Be sure to tell the user their password has changed.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    },
  });

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword.trim()) {
      mutation.mutate(newPassword); // Trigger the mutation with the new password
    } else {
      console.error('Password cannot be empty');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Password</CardTitle>
        <CardDescription>
          Type the password exactly as you want the user to enter it. We will
          securely encrypt it before storing it in the database.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit}>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="max-w-sm"
          />
          <div className="mt-4">
            <Button type="submit" disabled={!newPassword || mutation.isPending}>
              {mutation.isPending ? <Spinner /> : 'Update Password'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
