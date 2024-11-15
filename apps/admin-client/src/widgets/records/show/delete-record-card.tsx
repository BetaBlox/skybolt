import {
  AlertDialogHeader,
  AlertDialogFooter,
} from '@/components/alert-dialog';
import { Button } from '@/components/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/card';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/alert-dialog';
import { RecordPayload } from '@repo/types/admin';
import { getDashboard } from '@repo/admin-config';

interface Props {
  modelName: string;
  record: RecordPayload['record'];
  onDelete: () => void;
  disabled: boolean;
}
export default function DeleteRecordCard({
  modelName,
  record,
  onDelete,
  disabled = false,
}: Props) {
  const dashboard = getDashboard(modelName);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-red-500">Danger Zone</CardTitle>
        <CardDescription>
          This action <strong>CANNOT</strong> be undone. This will permanently
          delete the {modelName} record
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={disabled}>
              Delete {dashboard.getDisplayName(record)}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently remove the
                data from your application.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
