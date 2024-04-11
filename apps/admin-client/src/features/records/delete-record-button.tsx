import { RecordApi } from '@/api/RecordApi';
import { MODEL } from '@/common/routes';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/alert-dialog';
import { Button } from '@/components/button';
import { useToast } from '@/components/toast/use-toast';
import { getDashboard } from '@repo/admin-config';
import { AdminRecordPayload } from '@repo/types';
import { routeWithParams } from '@repo/utils';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

interface Props {
  payload: AdminRecordPayload;
}
export default function DeleteButton({ payload }: Props) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const deleteMutation = useMutation({
    mutationKey: ['delete', payload.modelName, payload.record.id],
    mutationFn: async () => RecordApi.delete(modelName, record.id),
  });

  const { record, modelName } = payload;
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
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="destructive" disabled={deleteMutation.isPending}>
          Delete {dashboard.getDisplayName(record)}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove the data
            from your application.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteRecord}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
