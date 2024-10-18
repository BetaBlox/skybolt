import {
  AdminFilterOperator,
  AdminFilterType,
  AdminHasManyAttributeType,
  AdminRecordsPayload,
  SortDirection,
} from '@repo/types';
import { getDashboard } from '@repo/admin-config';
import { MODEL_RECORD } from '@/common/routes';
import CollectionViewField from '@/features/models/collection-view-field';
import { routeWithParams } from '@repo/utils';
import { useNavigate } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import PaginationRow from '@/components/pagination-row';
import { RecordApi } from '@/api/RecordApi';
import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/table';
import { cn } from '@/lib/utils';
import { SortableTableHeader } from '@/components/sortable-table-header';
import { useCollectionState } from '@/hooks/use-collection-state';
import { Spinner } from '@/components/spinner';

interface Props {
  record: Record<string, unknown>;
  attributeType: AdminHasManyAttributeType;
}

export default function CollectionHasManyTable({
  record,
  attributeType,
}: Props) {
  const navigate = useNavigate();
  const {
    page,
    perPage,
    sortField,
    sortOrder,
    setPage,
    setPerPage,
    updateSort,
  } = useCollectionState({
    defaultPage: 1,
    defaultPerPage: 10,
    defaultSortField: 'id',
    defaultSortOrder: SortDirection.DESC,
  });

  // Assuming the primary key is `id` for the parent model record
  const parentRecordId = record['id'];
  const { modelName, relationField } = attributeType;
  const dashboard = getDashboard(modelName);

  const modelQuery = useQuery({
    queryKey: [
      'records',
      modelName,
      page,
      perPage,
      sortField,
      sortOrder,
      parentRecordId,
    ],
    queryFn: async () =>
      RecordApi.findMany(
        modelName,
        page,
        perPage,
        [
          {
            modelName: modelName,
            field: relationField,
            operator: AdminFilterOperator.EQUALS,
            value: String(parentRecordId),
            type: AdminFilterType.NUMBER,
          },
        ],
        sortField,
        sortOrder,
      ).then(({ data }) => data),
    placeholderData: keepPreviousData,
  });

  if (modelQuery.isPending) return <Spinner />;
  if (modelQuery.isError || !modelName) return 'Error loading data';

  const data = modelQuery.data as AdminRecordsPayload;

  const { collectionAttributes } = dashboard;
  const { paginatedResult } = data;

  return (
    <div>
      <div className="relative overflow-x-auto">
        {paginatedResult.data.length > 0 ? (
          <Table className="min-w-[500px]">
            <TableHeader>
              <TableRow>
                {collectionAttributes.map((attribute) => (
                  <SortableTableHeader
                    key={attribute}
                    attribute={attribute}
                    dashboard={dashboard}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onClick={() => updateSort(attribute)}
                  />
                ))}
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
                  {collectionAttributes.map((attribute, index) => (
                    <TableCell key={attribute}>
                      <div
                        className={cn('line-clamp-2 text-left', {
                          'w-[200px]': index === 0,
                          'sm:w-[300px]': index === 0,
                        })}
                      >
                        <CollectionViewField
                          record={record}
                          modelName={modelName}
                          attribute={attribute}
                        />
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-4 text-center text-gray-500">
            No related records found.
          </div>
        )}
      </div>
      <PaginationRow
        paginatedResult={paginatedResult}
        onPageChange={setPage}
        onPerPageChange={setPerPage}
      />
    </div>
  );
}
