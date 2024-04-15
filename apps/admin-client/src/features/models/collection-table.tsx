import { AdminRecordsPayload } from '@repo/types';
import { Dashboard } from '@repo/admin-config';
import { MODEL_RECORD, MODEL_RECORD_EDIT } from '@/common/routes';
import CollectionViewField from '@/features/models/collection-view-field';
import { routeWithParams, captilalize } from '@repo/utils';
import { Link } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import PaginationRow from '@/components/pagination-row';
import { useState } from 'react';
import { RecordApi } from '@/api/RecordApi';
import { Button } from '@/components/button';
import { EyeIcon, PencilIcon } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/table';

interface Props {
  modelName: string;
  dashboard: Dashboard<unknown>;
  search: string;
}
export default function CollectionTable({
  dashboard,
  modelName,
  search,
}: Props) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const modelQuery = useQuery({
    queryKey: ['records', modelName, search, page, perPage],
    queryFn: async () =>
      RecordApi.findMany(modelName, page, perPage, search).then(
        ({ data }) => data,
      ),
    placeholderData: keepPreviousData,
  });

  if (modelQuery.isPending) return 'Loading...';
  if (modelQuery.isError || !modelName) return 'Error loading data';

  const data = modelQuery.data as AdminRecordsPayload;

  const { collectionAttributes, isEditable } = dashboard;
  const { paginatedResult } = data;

  return (
    <div className="bg-white shadow-md sm:rounded-lg">
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
