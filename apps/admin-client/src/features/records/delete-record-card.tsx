import { RecordApi } from '@/api/RecordApi';
import { MODEL } from '@/common/routes';
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
import { useToast } from '@/components/toast/use-toast';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/alert-dialog';
import { getDashboard } from '@repo/admin-config';
import { AdminRecordPayload } from '@repo/types';
import { routeWithParams } from '@repo/utils';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

interface Props {
  modelName: string;
  record: AdminRecordPayload['record'];
}
export default function DeleteRecordCard({ modelName, record }: Props) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const deleteMutation = useMutation({
    mutationKey: ['delete', modelName, record.id],
    mutationFn: async () => RecordApi.delete(modelName, record.id),
  });

  const dashboard = getDashboard(modelName);

  const deleteRecord = async () => {
    const { response } = await deleteMutation.mutateAsync();

    if (response.ok) {
      toast({
        title: 'Record deleted',
        description: 'Your data has been removed.',
      });
      const modelUrl = routeWithParams(MODEL, {
        modelName,
      });
      navigate(modelUrl);
    } else {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="mt-6">
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
            <Button variant="destructive" disabled={deleteMutation.isPending}>
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
              <AlertDialogAction onClick={deleteRecord}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
