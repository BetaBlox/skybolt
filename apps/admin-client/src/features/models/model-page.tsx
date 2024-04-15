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

export default function ModelPage() {
  const { modelName } = useParams();
  const [search, setSearch] = useDebounceValue('', 500);

  if (!modelName) return 'Loading...';

  const dashboard = getDashboard(modelName);

  const { searchAttributes = [], isCreatable } = dashboard;

  const actions = (
    <div className="flex flex-row gap-x-4">
      {searchAttributes.length > 0 && (
        <Input
          type="search"
          id="search"
          name="search"
          placeholder="Search"
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
      )}
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
      <CollectionTable
        dashboard={dashboard}
        modelName={modelName}
        search={search}
      />
    </div>
  );
}
