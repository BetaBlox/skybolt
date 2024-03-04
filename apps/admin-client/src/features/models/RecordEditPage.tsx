import { useQuery } from '@tanstack/react-query';
import PageHeader from '@/components/PageHeader';
import { modelDisplayName } from '@/config/admin';
import { useParams } from 'react-router-dom';
import { routeWithParams } from '@repo/utils';
import { MODEL } from '@/common/routes';
import UpdateForm from '@/components/UpdateForm';
import { AdminRecordPayload } from '@repo/types';
import { HttpMethod, customFetch } from '@/common/custom-fetcher';

export default function RecordEditPage() {
  const { modelName, id } = useParams();

  const recordQuery = useQuery({
    queryKey: [`${modelName}/${id}`],
    queryFn: async () => {
      const url = routeWithParams(`/api/records/:modelName/:id`, {
        modelName,
        id,
      });
      const { data } = await customFetch(url, {
        method: HttpMethod.GET,
      });
      return data;
    },
  });

  if (recordQuery.isPending) return 'Loading...';
  if (recordQuery.isError || !modelName) return 'Error loading data';

  const data = recordQuery.data as AdminRecordPayload;

  const {
    attributeTypes,
    prismaModelConfig,
    formAttributes,
    record,
    displayName,
  } = data;

  return (
    <div>
      <PageHeader
        heading={displayName}
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
            text: displayName,
            current: true,
          },
        ]}
      />
      <UpdateForm
        modelName={modelName}
        record={record}
        prismaModelConfig={prismaModelConfig}
        attributeTypes={attributeTypes}
        formAttributes={formAttributes}
      />
    </div>
  );
}
