import { MODEL } from '@/common/routes';
import { Notify } from '@/config/notification/notification.service';
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

  const { record, displayName, prismaModelConfig } = payload;
  const { name: modelName } = prismaModelConfig;

  const handleClick = async () => {
    setSaving(true);

    const message = `Delete ${displayName}?`;

    if (window.confirm(message)) {
      try {
        const url = routeWithParams(`/api/records/:modelName/:id`, {
          modelName,
          id: record.id,
        });
        const res = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          Notify.success();
          const modelUrl = routeWithParams(MODEL, {
            modelName,
          });
          navigate(modelUrl);
        } else {
          Notify.error();
        }
      } catch (error) {
        Notify.error();
        console.error(error);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <button
      onClick={() => handleClick(modelName, record)}
      className="rounded bg-red-500 px-3 py-2 font-medium text-white hover:bg-red-600"
      disabled={saving}
    >
      Delete {displayName}
    </button>
  );
}
