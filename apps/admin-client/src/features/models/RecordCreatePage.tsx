import { useQuery } from '@tanstack/react-query';
import PageHeader from '@/components/PageHeader';
import { useParams } from 'react-router-dom';
import { routeWithParams } from '@repo/utils';
import { MODEL } from '@/common/routes';
import CreateForm from '@/components/CreateForm';
import { getDashboard } from '@repo/admin-config';
import { AdminRecordPayload } from '@repo/types';
import { ModelApi } from '@/api/ModelApi';

export default function RecordCreatePage() {
  const { modelName } = useParams();
  const recordQuery = useQuery({
    queryKey: ['models', modelName],
    queryFn: async () => ModelApi.findOne(modelName!).then(({ data }) => data),
  });

  if (recordQuery.isPending) return 'Loading...';
  if (recordQuery.isError || !modelName) return 'Error loading data';

  const data = recordQuery.data as AdminRecordPayload;
  const dashboard = getDashboard(modelName);
  const { attributeTypes, createFormAttributes } = dashboard;
  const { fields } = data;

  return (
    <div>
      <PageHeader
        heading={'Create'}
        breadcrumbs={[
          {
            href: routeWithParams(MODEL, {
              modelName,
            }),
            text: dashboard.name,
            current: false,
          },
          {
            href: '#',
            text: 'Create',
            current: true,
          },
        ]}
      />
      <CreateForm
        modelName={modelName}
        fields={fields}
        attributeTypes={attributeTypes}
        formAttributes={createFormAttributes}
      />
    </div>
  );
}
