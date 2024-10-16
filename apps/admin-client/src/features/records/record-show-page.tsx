import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { captilalize, routeWithParams } from '@repo/utils';
import PageHeader from '@/components/page-header';
import { HOME, MODEL, MODEL_RECORD_EDIT } from '@/common/routes';
import {
  AdminRecordPayload,
  AdminFieldType,
  AdminHasManyAttributeType,
} from '@repo/types';
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
import { Card, CardContent } from '@/components/card';
import ShowViewField from '@/features/records/show-view-field';
import DeleteRecordCard from '@/features/records/delete-record-card';
import { PageSection } from '@/components/page-section';
import CollectionHasManyTable from '@/features/records/collection-has-many-table';
import { useState } from 'react';
import { useToast } from '@/components/toast/use-toast';
import { Edit, Plus, Trash2, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs';

export default function RecordShowPage() {
  const { modelName, id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const recordQuery = useQuery({
    queryKey: [modelName, id],
    queryFn: async () =>
      RecordApi.findOne(modelName!, parseInt(id!)).then(({ data }) => data),
  });
  const deleteMutation = useMutation({
    mutationKey: ['delete', modelName, id],
    mutationFn: async () => RecordApi.delete(modelName!, record.id),
  });

  if (recordQuery.isPending) return 'Loading...';
  if (recordQuery.isError || !modelName) return 'Error loading data';

  const deleteRecord = async () => {
    const { response } = await deleteMutation.mutateAsync();

    if (response.ok) {
      toast({
        title: 'Record deleted',
        description: 'Your data has been removed.',
      });
      const modelUrl = routeWithParams(MODEL, {
        modelName,
      });
      navigate(modelUrl);
    } else {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
        variant: 'destructive',
      });
    }
  };

  const data = recordQuery.data as AdminRecordPayload;
  const dashboard = getDashboard(data.modelName);

  const { record } = data;
  const { showAttributes, getDisplayName } = dashboard;
  const isEditable = dashboard.isEditable(record);
  const isDeletable = dashboard.isDeletable(record);

  const actions = isEditable ? (
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

  const hasManyAttributes = dashboard.attributeTypes.filter(
    (attr) => attr.type === AdminFieldType.RELATIONSHIP_HAS_MANY,
  ) as AdminHasManyAttributeType[];

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
            <BreadcrumbPage>{getDisplayName(record)}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PageHeader heading={getDisplayName(record)} actions={actions} />

      <PageSection>
        <Card>
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
      </PageSection>

      {hasManyAttributes.length > 0 && (
        <PageSection>
          <Tabs defaultValue={hasManyAttributes[0].name}>
            <TabsList className="h-14 pl-0">
              {hasManyAttributes.map((attributeType) => (
                <TabsTrigger
                  key={attributeType.name}
                  value={attributeType.name}
                  className="h-14 rounded-bl-none rounded-br-none text-lg data-[state=active]:border-l data-[state=active]:border-r data-[state=active]:border-t data-[state=active]:shadow-none"
                >
                  {captilalize(attributeType.name)}
                </TabsTrigger>
              ))}
            </TabsList>
            {hasManyAttributes.map((attributeType) => (
              <TabsContent
                key={attributeType.name}
                value={attributeType.name}
                className="mt-0 rounded-lg rounded-tl-none border-b border-l border-r bg-white pt-10 shadow-md"
              >
                <div className="">
                  <CollectionHasManyTable
                    attributeType={attributeType}
                    record={record}
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </PageSection>
      )}

      {isDeletable && (
        <PageSection>
          <DeleteRecordCard
            record={data.record}
            modelName={modelName}
            disabled={deleteMutation.isPending}
            onDelete={deleteRecord}
          />
        </PageSection>
      )}

      <FloatingActionButton
        isDeletable={isDeletable}
        isEditable={isEditable}
        onDelete={() => {
          const confirm = window.confirm(
            'Are you sure you want to delete this record?',
          );

          if (confirm) {
            deleteRecord();
          }
        }}
      />
    </div>
  );
}

interface FloatingActionButtonProps {
  isEditable: boolean;
  isDeletable: boolean;
  onDelete: () => void;
}

function FloatingActionButton({
  isEditable,
  isDeletable,
  onDelete,
}: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false); // Toggle expansion state
  const { modelName, id } = useParams();

  const isVisible = isEditable || isDeletable;

  if (!isVisible) return null;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2">
      {isExpanded && (
        <>
          {isEditable && (
            <Button
              asChild
              className="flex items-center gap-x-2 rounded-3xl shadow-xl"
              variant="outline"
            >
              <Link
                to={routeWithParams(MODEL_RECORD_EDIT, {
                  modelName,
                  id: String(id),
                })}
              >
                <Edit className="h-4 w-4" /> Edit
              </Link>
            </Button>
          )}
          {isDeletable && (
            <Button
              variant="destructive"
              className="flex items-center gap-x-2 rounded-3xl shadow-xl"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          )}
        </>
      )}

      {/* Floating Action Button */}
      <Button className="h-16 w-16 rounded-full p-2" onClick={toggleExpand}>
        {isExpanded ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </Button>
    </div>
  );
}
