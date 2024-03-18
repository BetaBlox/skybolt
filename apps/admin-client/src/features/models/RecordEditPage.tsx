import { useQuery } from '@tanstack/react-query';
import PageHeader from '@/components/PageHeader';
import { modelDisplayName } from '@/common/model-display-name';
import { useParams } from 'react-router-dom';
import { routeWithParams } from '@repo/utils';
import { MODEL } from '@/common/routes';
import UpdateForm from '@/components/UpdateForm';
import { AdminRecordPayload } from '@repo/types';
import { getDashboard } from '@repo/admin-config';
import { RecordApi } from '@/api/RecordApi';

export default function RecordEditPage() {
  const { modelName, id } = useParams();

  const recordQuery = useQuery({
    queryKey: [modelName, id],
    queryFn: async () =>
      RecordApi.findOne(modelName!, parseInt(id!)).then(({ data }) => data),
  });

  if (recordQuery.isPending) return 'Loading...';
  if (recordQuery.isError || !modelName) return 'Error loading data';

  const data = recordQuery.data as AdminRecordPayload;
  const dashboard = getDashboard(modelName);

  const { record, fields } = data;

  return (
    <div>
      <PageHeader
        heading={dashboard.getDisplayName(record)}
        breadcrumbs={[
          {
            href: routeWithParams(MODEL, {
              modelName,
            }),
            text: modelDisplayName(modelName),
            current: false,
          },
          {
            href: '#',
            text: dashboard.getDisplayName(record),
            current: true,
          },
        ]}
      />
      <UpdateForm
        modelName={modelName}
        fields={fields}
        record={record}
        attributeTypes={dashboard.attributeTypes}
        formAttributes={dashboard.editFormAttributes}
      />
    </div>
  );
}
