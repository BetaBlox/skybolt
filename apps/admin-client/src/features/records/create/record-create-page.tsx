import { useQuery } from '@tanstack/react-query';
import PageHeader from '@/widgets/core/page-header';
import { useParams } from 'react-router-dom';
import { routeWithParams } from '@repo/utils';
import { HOME, MODEL } from '@/common/routes';
import { getDashboard } from '@repo/admin-config';
import { RecordPayload } from '@repo/types/admin';
import { ModelApi } from '@/api/ModelApi';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/breadcrumb';
import { Spinner } from '@/components/spinner';
import RecordCreateForm from '@/widgets/records/create/record-create-form';

export default function RecordCreatePage() {
  const { modelName } = useParams();
  const recordQuery = useQuery({
    queryKey: ['models', modelName],
    queryFn: async () => ModelApi.findOne(modelName!).then(({ data }) => data),
  });

  if (recordQuery.isPending) return <Spinner />;
  if (recordQuery.isError || !modelName) return 'Error loading data';

  const data = recordQuery.data as RecordPayload;
  const dashboard = getDashboard(modelName);
  const { attributeTypes, createFormAttributes } = dashboard;
  const { fields } = data;

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink to={HOME}>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              to={routeWithParams(MODEL, {
                modelName,
              })}
            >
              {dashboard.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PageHeader heading={'Create'} />
      <RecordCreateForm
        modelName={modelName}
        fields={fields}
        attributeTypes={attributeTypes}
        formAttributes={createFormAttributes}
      />
    </div>
  );
}
