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

export default function ModelPage() {
  const { modelName } = useParams();

  if (!modelName) return 'Loading...';

  const dashboard = getDashboard(modelName);

  const { isCreatable } = dashboard;

  const actions = (
    <div className="flex flex-row gap-x-4">
      {isCreatable() && (
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
    </div>
  );
}
