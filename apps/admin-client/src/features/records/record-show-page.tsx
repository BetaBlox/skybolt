import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { captilalize, routeWithParams } from '@repo/utils';
import PageHeader from '@/components/page-header';
import { MODEL, MODEL_RECORD_EDIT } from '@/common/routes';
import { AdminRecordPayload, AdminFieldType } from '@repo/types';
import DeleteButton from './delete-record-button';
import { getAttributeType, getDashboard } from '@repo/admin-config';
import { RecordApi } from '@/api/RecordApi';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/breadcrumb';
import { Button } from '@/components/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/card';
import ShowViewField from '@/features/records/show-view-field';

export default function RecordShowPage() {
  const { modelName, id } = useParams();

  const recordQuery = useQuery({
    queryKey: [modelName, id],
    queryFn: async () =>
      RecordApi.findOne(modelName!, parseInt(id!)).then(({ data }) => data),
  });

  if (recordQuery.isPending) return 'Loading...';
  if (recordQuery.isError || !modelName) return 'Error loading data';

  const data = recordQuery.data as AdminRecordPayload;
  const dashboard = getDashboard(data.modelName);

  const { record } = data;
  const { showAttributes, getDisplayName, isEditable, isDeletable } = dashboard;

  const actions = isEditable(record) ? (
    <Button asChild>
      <Link
        to={routeWithParams(MODEL_RECORD_EDIT, {
          modelName,
          id: record.id,
        })}
      >
        Edit
      </Link>
    </Button>
  ) : null;

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink to="/">Home</BreadcrumbLink>
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
            <BreadcrumbPage>{getDisplayName(record)}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PageHeader heading={getDisplayName(record)} actions={actions} />

      <Card className="mt-6">
        <CardContent>
          <dl className="divide-y divide-gray-100">
            {showAttributes.map((attribute) => {
              const attributeType = getAttributeType(modelName, attribute);

              return (
                <div
                  key={attributeType.name}
                  className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
                >
                  <dt className="text-sm font-bold leading-6 text-gray-900">
                    {captilalize(attributeType.name)}
                  </dt>
                  {attributeType.type === AdminFieldType.JSON ? (
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <pre>
                        <ShowViewField
                          record={record}
                          modelName={modelName}
                          attribute={attribute}
                        />
                      </pre>
                    </dd>
                  ) : (
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <ShowViewField
                        record={record}
                        modelName={modelName}
                        attribute={attribute}
                      />
                    </dd>
                  )}
                </div>
              );
            })}
          </dl>
        </CardContent>
      </Card>

      {isDeletable(record) && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-red-500">Danger Zone</CardTitle>
            <CardDescription>
              This action <strong>CANNOT</strong> be undone. This will
              permanently delete the {modelName} record
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeleteButton payload={data} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
