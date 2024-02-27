import { useQuery } from '@tanstack/react-query';
import PageHeader from '@/components/PageHeader';
import { modelDisplayName } from '@/config/admin';
import { DMMF } from 'database';
import { useParams } from 'react-router-dom';
import { routeWithParams } from 'utils';
import { AdminAttributeType } from '../../../../admin-api/src/config/admin';
import { MODEL } from '@/common/routes';
import CreateForm from '@/components/CreateForm';

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

  const data = recordQuery.data as {
    prismaModelConfig: DMMF.Model;
    attributeTypes: AdminAttributeType[];
    collectionAttributes: string[];
    showAttributes: string[];
    formAttributes: string[];
    // Ignoring for now because we don't have a type for this API payload
    record: any; // eslint-disable-line
  };

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
