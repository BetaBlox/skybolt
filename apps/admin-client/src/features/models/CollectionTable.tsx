import { AdminRecordsPayload } from '@repo/types';
import { Dashboard } from '@repo/admin-config';
import { MODEL_RECORD, MODEL_RECORD_EDIT } from '@/common/routes';
import CollectionViewField from '@/components/CollectionViewField';
import { routeWithParams, captilalize } from '@repo/utils';
import { Link } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import PaginationRow from '@/components/PaginationRow';
import { useState } from 'react';
import { RecordApi } from '@/api/RecordApi';

interface Props {
  modelName: string;
  dashboard: Dashboard;
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

  const { collectionAttributes } = dashboard;
  const { paginatedResult } = data;

  return (
    <div className="relative overflow-x-auto bg-white shadow-md sm:rounded-lg">
      <table className="w-full text-left text-sm text-gray-50">
        <thead className="bg-gray-600 text-xs text-white">
          <tr>
            <th scope="col" className="px-6 py-3">
              Id
            </th>
            {collectionAttributes.map((attribute) => (
              <th
                scope="col"
                key={attribute}
                className="whitespace-nowrap px-6 py-3"
              >
                {captilalize(attribute)}
              </th>
            ))}
            <th scope="col" className="px-6 py-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedResult.data.map((record) => (
            <tr key={record.id}>
              <td className="px-6 py-4 text-gray-900">{record.id}</td>
              {collectionAttributes.map((attribute) => (
                <td
                  key={attribute}
                  className="whitespace-nowrap px-6 py-4 text-gray-900"
                >
                  <CollectionViewField
                    record={record}
                    modelName={modelName}
                    attribute={attribute}
                  />
                </td>
              ))}
              <td className="flex flex-row gap-2 px-6 py-4 text-gray-900">
                <Link
                  to={routeWithParams(MODEL_RECORD, {
                    modelName,
                    id: String(record.id),
                  })}
                  className="rounded px-3 py-2 font-medium text-slate-500 hover:bg-slate-500 hover:text-white"
                >
                  Show
                </Link>
                {dashboard.isEditable(record) && (
                  <Link
                    to={routeWithParams(MODEL_RECORD_EDIT, {
                      modelName,
                      id: String(record.id),
                    })}
                    className="rounded px-3 py-2 font-medium text-indigo-500 hover:bg-indigo-500 hover:text-white"
                  >
                    Edit
                  </Link>
                )}
                {/* <DeleteButton modelName={modelName} record={record} /> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <PaginationRow
        paginatedResult={paginatedResult}
        onPageChange={setPage}
        onPerPageChange={setPerPage}
      />
    </div>
  );
}
