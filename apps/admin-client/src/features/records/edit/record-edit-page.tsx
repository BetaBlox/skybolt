import { useQuery } from '@tanstack/react-query';
import PageHeader from '@/widgets/core/page-header';
import { useParams } from 'react-router-dom';
import { routeWithParams } from '@repo/utils';
import { HOME, MODEL, MODEL_RECORD } from '@/common/routes';
import RecordUpdateForm from '@/widgets/records/edit/record-update-form';
import { AdminRecordPayload } from '@repo/types';
import { getDashboard } from '@repo/admin-config';
import { RecordApi } from '@/api/RecordApi';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/breadcrumb';
import { Spinner } from '@/components/spinner';

export default function RecordEditPage() {
  const { modelName, id } = useParams();

  const recordQuery = useQuery({
    queryKey: [modelName, id],
    queryFn: async () =>
      RecordApi.findOne(modelName!, parseInt(id!)).then(({ data }) => data),
  });

  if (recordQuery.isPending) return <Spinner />;
  if (recordQuery.isError || !modelName) return 'Error loading data';

  const data = recordQuery.data as AdminRecordPayload;
  const dashboard = getDashboard(modelName);

  const { record, fields } = data;

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
            <BreadcrumbLink
              to={routeWithParams(MODEL_RECORD, {
                modelName,
                id,
              })}
            >
              {dashboard.getDisplayName(record)}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PageHeader heading={dashboard.getDisplayName(record)} />
      <RecordUpdateForm
        modelName={modelName}
        fields={fields}
        record={record}
        attributeTypes={dashboard.attributeTypes}
        formAttributes={dashboard.editFormAttributes}
      />
    </div>
  );
}
