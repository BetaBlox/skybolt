import {
  AdminFilterOperator,
  AdminFilterType,
  AdminHasManyAttributeType,
  AdminRecordsPayload,
} from '@repo/types';
import { getDashboard } from '@repo/admin-config';
import { MODEL_RECORD } from '@/common/routes';
import CollectionViewField from '@/features/models/collection-view-field';
import { routeWithParams, captilalize } from '@repo/utils';
import { useNavigate } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import PaginationRow from '@/components/pagination-row';
import { useState } from 'react';
import { RecordApi } from '@/api/RecordApi';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/table';
import { cn } from '@/lib/utils';

interface Props {
  record: Record<string, unknown>;
  attributeType: AdminHasManyAttributeType;
}

export default function CollectionHasManyTable({
  record,
  attributeType,
}: Props) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Assuming the primary key is `id` for the parent model record
  const parentRecordId = record['id'];
  const { modelName, relationField } = attributeType;
  const dashboard = getDashboard(modelName);

  const modelQuery = useQuery({
    queryKey: ['records', modelName, page, perPage, parentRecordId],
    queryFn: async () =>
      RecordApi.findMany(modelName, page, perPage, [
        {
          modelName: modelName,
          field: relationField,
          operator: AdminFilterOperator.EQUALS,
          value: String(parentRecordId),
          type: AdminFilterType.NUMBER,
        },
      ]).then(({ data }) => data),
    placeholderData: keepPreviousData,
  });

  if (modelQuery.isPending) return 'Loading...';
  if (modelQuery.isError || !modelName) return 'Error loading data';

  const data = modelQuery.data as AdminRecordsPayload;

  const { collectionAttributes } = dashboard;
  const { paginatedResult } = data;

  return (
    <div className="bg-white shadow-md sm:rounded-lg">
      <div className="relative overflow-x-auto">
        {paginatedResult.data.length > 0 ? (
          <Table className="min-w-[500px]">
            <TableHeader>
              <TableRow>
                {collectionAttributes.map((attribute) => (
                  <TableHead key={attribute} className="whitespace-nowrap">
                    {captilalize(attribute)}
                  </TableHead>
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