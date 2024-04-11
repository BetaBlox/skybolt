import { RecordApi } from '@/api/RecordApi';
import { MODEL } from '@/common/routes';
import { Button } from '@/components/Button';
import { useToast } from '@/components/toast/use-toast';
import { getDashboard } from '@repo/admin-config';
import { AdminRecordPayload } from '@repo/types';
import { routeWithParams } from '@repo/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  payload: AdminRecordPayload;
}
export default function DeleteButton({ payload }: Props) {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { record, modelName } = payload;
  const dashboard = getDashboard(modelName);

  const handleClick = async () => {
    setSaving(true);

    const message = `Delete ${dashboard.getDisplayName(record)}?`;

    if (window.confirm(message)) {
      try {
        const { response } = await RecordApi.delete(modelName, record.id);

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
      } catch (error) {
        console.error(error);
        toast({
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.',
          variant: 'destructive',
        });
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <Button onClick={handleClick} variant="destructive" disabled={saving}>
      Delete {dashboard.getDisplayName(record)}
    </Button>
  );
}
