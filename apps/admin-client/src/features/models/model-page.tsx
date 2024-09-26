import { Link, useParams } from 'react-router-dom';
import { routeWithParams } from '@repo/utils';
import PageHeader from '@/components/page-header';
import { MODEL_RECORD_CREATE } from '@/common/routes';
import { getDashboard } from '@repo/admin-config';
import CollectionTable from './collection-table';
import { useDebounceValue } from 'usehooks-ts';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/breadcrumb';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { RecordRegistrationsChart } from '@/charts/record-registrations-chart';
import { KpiCards } from '@/features/models/kpi-cards';

export default function ModelPage() {
  const { modelName } = useParams();
  const [search, setSearch] = useDebounceValue('', 500);

  if (!modelName) return 'Loading...';

  const dashboard = getDashboard(modelName);

  const { searchAttributes = [], isCreatable } = dashboard;

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
            <BreadcrumbLink to="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{dashboard.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PageHeader heading={dashboard.name} actions={actions} />

      <div className="mb-20">
        <KpiCards modelName={modelName} />
      </div>

      <div className="mb-20">
        <RecordRegistrationsChart
          modelName={modelName}
          title="This Year By Month"
        />
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold leading-none tracking-tight">
          All Records
        </h2>
        {searchAttributes.length > 0 && (
          <Input
            type="search"
            id="search"
            name="search"
            placeholder="Search"
            onChange={(e) => setSearch(e.currentTarget.value)}
            className="max-w-[300px]"
          />
        )}
      </div>
      <CollectionTable
        dashboard={dashboard}
        modelName={modelName}
        search={search}
      />
    </div>
  );
}
