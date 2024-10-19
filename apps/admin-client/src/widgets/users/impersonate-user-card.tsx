import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/card';
import { Dashboard } from '@repo/admin-config';
import { User } from '@repo/database';
import { ImpersonateButton } from '@/components/ImpersonateButton';

interface Props {
  dashboard: Dashboard<User>;
  modelName: string;
  record: User;
}

export const ImpersonateUserCard = ({ record }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Impersonate User</CardTitle>
        <CardDescription>
          You can impersonate this user to see what they see in the application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mt-4">
          <ImpersonateButton userId={record.id} />
        </div>
      </CardContent>
    </Card>
  );
};
