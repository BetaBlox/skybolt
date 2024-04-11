import { RecordApi } from '@/api/RecordApi';
import { MODEL } from '@/common/routes';
import { Button } from '@/components/Button';
import { Notify } from '@/config/notification/notification.service';
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
          Notify.success();
          const modelUrl = routeWithParams(MODEL, {
            modelName,
          });
          navigate(modelUrl);
        } else {
          Notify.error();
        }
      } catch (error) {
        console.error(error);
        Notify.error();
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
