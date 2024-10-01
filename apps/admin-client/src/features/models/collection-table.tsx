import { AdminRecordsPayload } from '@repo/types';
import { Dashboard } from '@repo/admin-config';
import { MODEL_RECORD, MODEL_RECORD_EDIT } from '@/common/routes';
import CollectionViewField from '@/features/models/collection-view-field';
import { routeWithParams, captilalize } from '@repo/utils';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import PaginationRow from '@/components/pagination-row';
import { useEffect, useState } from 'react';
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
import FilterForm, { Filter } from '@/features/models/filter-form';

interface Props {
  modelName: string;
  dashboard: Dashboard<unknown>;
}

export default function CollectionTable({ dashboard, modelName }: Props) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [filters, setFilters] = useState<Filter[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();

  // Sync filters from URL on initial load
  useEffect(() => {
    const urlFilters = searchParams.get('filters');
    if (urlFilters) {
      try {
        setFilters(JSON.parse(urlFilters));
      } catch (error) {
        console.error('Invalid filter format in URL');
      }
    }

    // Set initial page and perPage if available in URL
    const pageParam = searchParams.get('page');
    if (pageParam) setPage(parseInt(pageParam, 10));

    const perPageParam = searchParams.get('perPage');
    if (perPageParam) setPerPage(parseInt(perPageParam, 10));
  }, []);

  // Update URL whenever filters, page, or perPage change
  useEffect(() => {
    const params = {
      filters: JSON.stringify(filters),
      page: String(page),
      perPage: String(perPage),
    };

    // Update search params without reloading the page
    setSearchParams(params);
  }, [filters, page, perPage, setSearchParams]);

  const modelQuery = useQuery({
    queryKey: ['records', modelName, page, perPage, filters],
    queryFn: async () =>
      RecordApi.findMany(modelName, page, perPage, filters).then(
        ({ data }) => data,
      ),
    placeholderData: keepPreviousData,
  });

  if (modelQuery.isPending) return 'Loading...';
  if (modelQuery.isError || !modelName) return 'Error loading data';

  const data = modelQuery.data as AdminRecordsPayload;

  const { collectionAttributes, isEditable } = dashboard;
  const { paginatedResult } = data;

  const applyFilter = (filter: Filter) => {
    setFilters([...filters, filter]);
    setPage(1); // Reset to the first page when applying new filters
  };

  const clearFilters = () => {
    setFilters([]);
    setPage(1); // Reset to the first page when clearing filters
  };

  const removeFilter = (indexToRemove: number) => {
    const newFilters = filters.filter((_, index) => index !== indexToRemove);
    setFilters(newFilters);
    setPage(1); // Reset to the first page when removing a filter
  };

  return (
    <div className="bg-white shadow-md sm:rounded-lg">
      {dashboard.collectionFilterAttributes.length > 0 && (
        <FilterForm
          dashboard={dashboard}
          onApplyFilter={applyFilter}
          onClearFilters={clearFilters}
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
              <TableHead>Id</TableHead>
              {collectionAttributes.map((attribute) => (
                <TableHead key={attribute} className="whitespace-nowrap">
                  {captilalize(attribute)}
                </TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedResult.data.map((record) => (
              <TableRow
                key={record.id}
                onMouseDown={() =>
                  navigate(
                    routeWithParams(MODEL_RECORD, {
                      modelName,
                      id: String(record.id),
                    }),
                  )
                }
                className="cursor-pointer"
              >
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
