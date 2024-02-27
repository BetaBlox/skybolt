import { useQuery } from '@tanstack/react-query';
import PageHeader from '@/components/PageHeader';
import { modelDisplayName } from '@/config/admin';
import { useParams } from 'react-router-dom';
import { routeWithParams } from '@repo/utils';
import { MODEL } from '@/common/routes';
import CreateForm from '@/components/CreateForm';
import { AdminRecordPayload } from '@repo/types';

export default function RecordCreatePage() {
  const { modelName, id } = useParams();

  const recordQuery = useQuery({
    queryKey: [`models/${modelName}`],
    queryFn: async () => {
      const url = routeWithParams(`/api/models/:modelName`, {
        modelName,
        id,
      });
      const res = await fetch(url, {
        method: 'GET',
      });
      return res.json();
    },
  });

  if (recordQuery.isPending) return 'Loading...';
  if (recordQuery.isError || !modelName) return 'Error loading data';

  const data = recordQuery.data as AdminRecordPayload;

  const { attributeTypes, prismaModelConfig, formAttributes } = data;

  return (
    <div>
      <PageHeader
        heading={'Create'}
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
            text: 'Create',
            current: true,
          },
        ]}
      />
      <CreateForm
        modelName={modelName}
        prismaModelConfig={prismaModelConfig}
        attributeTypes={attributeTypes}
        formAttributes={formAttributes}
      />
    </div>
  );
}
