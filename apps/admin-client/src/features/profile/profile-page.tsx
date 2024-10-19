import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Card, CardContent, CardHeader } from '@/components/card';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/components/toast/use-toast';
import { AuthProvider, updateUserProfile } from '@repo/auth';
import { User } from '@repo/database';
import { Label } from '@/components/label';
import PageHeader from '@/widgets/core/page-header';

export default function ProfilePage() {
  const user = AuthProvider.user!;
  const { toast } = useToast();

  const updateProfileMutation = useMutation({
    mutationKey: ['update-profile', user.id],
    mutationFn: async (profileData: Partial<User>) => {
      const response = await updateUserProfile(profileData);
      if (!response.ok) {
        throw new Error('Error updating profile');
      }
    },
    onSuccess: () => {
      toast({
        title: 'Profile updated successfully',
        description: 'Your profile information has been saved.',
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error updating profile',
        description: 'Something went wrong. Please try again.',
      });
    },
  });

  // Handle profile update submission
  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const profile = Object.fromEntries(formData.entries());
    updateProfileMutation.mutate(profile);
  };

  return (
    <div className="space-y-6">
      <PageHeader heading="My Profile" />
      <Card className="max-w-[1000px]">
        <CardHeader>
          {/* <CardTitle>Profile Information</CardTitle> */}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="col-span-1">
                <Label htmlFor="firstName">First Name</Label>
                <div className="mt-2">
                  <Input
                    id="firstName"
                    name="firstName"
                    defaultValue={user.firstName}
                    required
                  />
                </div>
              </div>
              <div className="col-span-1">
                <Label htmlFor="lastName">Last Name</Label>
                <div className="mt-2">
                  <Input
                    id="lastName"
                    name="lastName"
                    defaultValue={user.lastName}
                    required
                  />
                </div>
              </div>
              <div className="col-span-1">
                <Label htmlFor="email">Email</Label>
                <div className="mt-2">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={user.email}
                    required
                  />
                </div>
              </div>
            </div>
            <Button type="submit" className="mt-4">
              Save Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
