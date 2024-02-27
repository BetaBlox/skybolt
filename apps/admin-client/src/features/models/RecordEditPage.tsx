import { useQuery } from '@tanstack/react-query';
import PageHeader from '@/components/PageHeader';
import { collectionUrl, modelDisplayName, showUrl } from '@/config/admin';
import { DMMF } from 'database';
import { useParams } from 'react-router-dom';
import { routeWithParams } from 'utils';
import { AdminAttributeType } from '../../../../admin-api/src/config/admin';
import { MODEL } from '@/common/routes';
import UpdateForm from '@/components/UpdateForm';

export default function RecordEditPage() {
  const { modelName, id } = useParams();

  const recordQuery = useQuery({
    queryKey: [`${modelName}/${id}`],
    queryFn: async () => {
      const url = routeWithParams(`/api/models/:modelName/:id`, {
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
    displayName: string;
  };

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
