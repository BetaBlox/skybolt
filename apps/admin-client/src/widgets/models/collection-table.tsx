import { RecordsPayload } from '@repo/types/admin';
import { SortDirection } from '@repo/types/sort';
import { Dashboard } from '@repo/admin-config';
import { MODEL_RECORD, MODEL_RECORD_EDIT } from '@/common/routes';
import CollectionViewField from '@/widgets/models/collection-view-field';
import { routeWithParams, captilalize } from '@repo/utils';
import { Link } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import PaginationRow from '@/components/pagination-row';
import { RecordApi } from '@/api/RecordApi';
import { Button } from '@/components/button';
import { EyeIcon, PencilIcon, XIcon } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/table';
import FilterForm from '@/widgets/models/filter-form';
import { SortableTableHeader } from '@/components/sortable-table-header';
import { ImpersonateButton } from '@/components/ImpersonateButton';
import { useCollectionState } from '@/hooks/use-collection-state';
import { Spinner } from '@/components/spinner';

interface Props {
  modelName: string;
  dashboard: Dashboard<unknown>;
}

export default function CollectionTable({ dashboard, modelName }: Props) {
  const {
    page,
    perPage,
    sortField,
    sortOrder,
    filters,
    setPage,
    setPerPage,
    updateSort,
    applyFilter,
    removeFilter,
    resetFilters,
  } = useCollectionState({
    defaultPage: 1,
    defaultPerPage: 10,
    defaultSortField: 'id',
    defaultSortOrder: SortDirection.DESC,
  });

  const modelQuery = useQuery({
    queryKey: [
      'records',
      modelName,
      page,
      perPage,
      filters,
      sortField,
      sortOrder,
    ],
    queryFn: async () =>
      RecordApi.findMany(
        modelName,
        page,
        perPage,
        filters,
        sortField,
        sortOrder,
      ).then(({ data }) => data),
    placeholderData: keepPreviousData,
  });

  if (modelQuery.isPending) return <Spinner />;
  if (modelQuery.isError || !modelName) return 'Error loading data';

  const data = modelQuery.data as RecordsPayload;

  const { collectionAttributes, isEditable } = dashboard;
  const { paginatedResult } = data;

  return (
    <div className="bg-white shadow-md sm:rounded-lg">
      {dashboard.collectionFilterAttributes.length > 0 && (
        <FilterForm
          dashboard={dashboard}
          onApplyFilter={applyFilter}
          onClearFilters={resetFilters}
        />
      )}

      {/* Display Active Filters */}
      {filters.length > 0 && (
        <div className="mb-4 pl-4 pr-4">
          <div className="mt-2 flex flex-row flex-wrap gap-2">
            {filters.map((filter, index) => (
              <div
                key={index}
                className="flex items-center rounded-full bg-gray-200 px-3 py-1 text-gray-700"
              >
                <span className="mr-2 text-sm">
                  {captilalize(filter.field)}{' '}
                  {captilalize(filter.operator).toLowerCase()} "{filter.value}"
                </span>
                <Button
                  size="icon"
                  variant={'ghost'}
                  onClick={() => removeFilter(index)}
                  className="h-6 w-6"
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {['id', ...collectionAttributes].map((attribute) => (
                <SortableTableHeader
                  key={attribute}
                  attribute={attribute}
                  dashboard={dashboard}
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onClick={() => updateSort(attribute)}
                />
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedResult.data.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.id}</TableCell>
                {collectionAttributes.map((attribute) => (
                  <TableCell key={attribute}>
                    <CollectionViewField
                      record={record}
                      modelName={modelName}
                      attribute={attribute}
                    />
                  </TableCell>
                ))}
                <TableCell className="flex flex-row gap-2">
                  <Button asChild variant="secondary" size="sm">
                    <Link
                      to={routeWithParams(MODEL_RECORD, {
                        modelName,
                        id: String(record.id),
                      })}
                    >
                      <EyeIcon className="mr-1 h-3 w-3" /> Show
                    </Link>
                  </Button>
                  {isEditable(record) && (
                    <Button asChild variant="outline" size="sm">
                      <Link
                        to={routeWithParams(MODEL_RECORD_EDIT, {
                          modelName,
                          id: String(record.id),
                        })}
                      >
                        <PencilIcon className="mr-1 h-3 w-3" /> Edit
                      </Link>
                    </Button>
                  )}
                  {modelName.toLowerCase() === 'user' && (
                    <ImpersonateButton userId={record.id} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PaginationRow
        paginatedResult={paginatedResult}
        onPageChange={setPage}
        onPerPageChange={setPerPage}
      />
    </div>
  );
}
