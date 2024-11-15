import { attrIsSortable } from '@/common/admin-attr-is-sortable';
import { TableHead } from '@/components/table';
import { Dashboard } from '@repo/admin-config';
import { SortDirection, SortOrder } from '@repo/types/sort';
import { captilalize } from '@repo/utils';
import { SortAscIcon, SortDescIcon } from 'lucide-react';

interface Props {
  attribute: string;
  dashboard: Dashboard<unknown>;
  sortField: string;
  sortOrder: SortOrder;
  onClick: (attribute: string) => void;
}
export const SortableTableHeader = ({
  attribute,
  dashboard,
  sortField,
  sortOrder,
  onClick,
}: Props) => {
  const isSortable = attrIsSortable(attribute, dashboard);

  if (!isSortable) {
    return (
      <TableHead className={'whitespace-nowrap'}>
        <div className="flex items-center">{captilalize(attribute)}</div>
      </TableHead>
    );
  }

  return (
    <TableHead
      className={'cursor-pointer whitespace-nowrap'}
      onClick={() => onClick(attribute)}
    >
      {isSortable && (
        <div className="flex items-center">
          {captilalize(attribute)}
          {sortField === attribute ? (
            sortOrder === SortDirection.ASC ? (
              <SortAscIcon className="ml-2 h-4 w-4 text-blue-500" /> // Active sort asc
            ) : (
              <SortDescIcon className="ml-2 h-4 w-4 text-blue-500" /> // Active sort desc
            )
          ) : (
            <SortAscIcon className="ml-2 h-4 w-4 text-gray-300" /> // Default icon
          )}
        </div>
      )}
    </TableHead>
  );
};
