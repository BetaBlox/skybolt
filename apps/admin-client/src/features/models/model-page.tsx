import { Link, useParams } from 'react-router-dom';
import { routeWithParams } from '@repo/utils';
import PageHeader from '@/components/page-header';
import { HOME, MODEL_RECORD_CREATE } from '@/common/routes';
import { getDashboard } from '@repo/admin-config';
import CollectionTable from './collection-table';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/breadcrumb';
import { Button } from '@/components/button';
import { RecordRegistrationsChart } from '@/charts/record-registrations-chart';
import { KpiCards } from '@/features/models/kpi-cards';
import { PageSection } from '@/components/page-section';
import { PageSectionHeading } from '@/components/page-section-heading';
import { useState } from 'react';
import { FilePlus, Plus, X } from 'lucide-react';

export default function ModelPage() {
  const { modelName } = useParams();

  if (!modelName) return 'Loading...';

  const dashboard = getDashboard(modelName);

  const isCreatable = dashboard.isCreatable();

  const actions = (
    <div className="flex flex-row gap-x-4">
      {isCreatable && (
        <Button asChild>
          <Link
            to={routeWithParams(MODEL_RECORD_CREATE, {
              modelName,
            })}
          >
            Add New
          </Link>
        </Button>
      )}
    </div>
  );

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink to={HOME}>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{dashboard.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PageHeader heading={dashboard.name} actions={actions} />

      <PageSection>
        <KpiCards modelName={modelName} />
      </PageSection>

      <PageSection>
        <PageSectionHeading>This Year By Month</PageSectionHeading>
        <RecordRegistrationsChart modelName={'user'} />
      </PageSection>

      <PageSectionHeading>All Records</PageSectionHeading>
      <CollectionTable dashboard={dashboard} modelName={modelName} />

      <FloatingActionButton isCreatable={isCreatable} />
    </div>
  );
}

interface FloatingActionButtonProps {
  isCreatable: boolean;
}

function FloatingActionButton({ isCreatable }: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false); // Toggle expansion state
  const { modelName } = useParams();

  const isVisible = isCreatable;

  if (!isVisible) return null;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2">
      {isExpanded && (
        <>
          {isCreatable && (
            <Button
              asChild
              className="flex items-center gap-x-2 rounded-3xl shadow-xl"
              variant="outline"
            >
              <Link
                to={routeWithParams(MODEL_RECORD_CREATE, {
                  modelName,
                })}
              >
                <FilePlus className="h-4 w-4" /> Create Record
              </Link>
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
