import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { routeWithParams } from '@repo/utils';
import PageHeader from '@/widgets/core/page-header';
import { HOME, MODEL, MODEL_RECORD_EDIT } from '@/common/routes';
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
import { Button } from '@/components/button';
import DeleteRecordCard from '@/widgets/records/show/delete-record-card';
import { PageSection } from '@/widgets/core/page-section';
import { useState } from 'react';
import { useToast } from '@/components/toast/use-toast';
import { Edit, Plus, Trash2, X } from 'lucide-react';
import { WidgetLayout } from '@/features/records/show/widget-layout';
import { Spinner } from '@/components/spinner';

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

  if (recordQuery.isPending) return <Spinner />;
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
  const { getDisplayName } = dashboard;
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

      {/* Custom widgets from record dashboard configuration. 
          Eventually we're planning to move all components here
          to make the admin dashboards fully customizable
      */}
      <WidgetLayout
        dashboard={dashboard}
        modelName={modelName}
        record={record}
      />

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
