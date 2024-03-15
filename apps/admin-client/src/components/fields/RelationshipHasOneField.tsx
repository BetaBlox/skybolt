import { ChangeEvent } from 'react';
import FieldLabel from '../FieldLabel';
import { useQuery } from '@tanstack/react-query';
import { routeWithParams } from '@repo/utils';
import {
  AdminAttributeType,
  AdminModelField,
  AdminRecordsPayload,
  SelectOption,
} from '@repo/types';
import { HttpMethod, customFetch } from '@/common/custom-fetcher';
import { getDashboard } from '@repo/admin-config';

interface Props {
  field: AdminModelField;
  modelName: string;
  attribute: string;
  attributeType: AdminAttributeType;
  value: string | number;
  onChange: (key: string, value: string | number) => void;
}
export default function RelationshipHasOneField({
  field,
  attributeType,
  value = '',
  onChange,
}: Props) {
  const { modelName } = attributeType;

  const recordsQuery = useQuery({
    queryKey: ['hasOne', modelName],
    queryFn: async () => {
      const url = routeWithParams('/api/records/:modelName', { modelName });
      const { data } = await customFetch(url, {
        method: HttpMethod.GET,
      });
      return data;
    },
  });

  if (recordsQuery.isPending) return 'Loading...';
  if (recordsQuery.isError || !modelName) return 'Error loading data';

  const data = recordsQuery.data as AdminRecordsPayload;
  const relatedDashboard = getDashboard(data.modelName);

  // TODO: paginated results are limited to 20, probably an issue
  const options: SelectOption[] = data.paginatedResult.data.map((r) => ({
    value: r.id,
    label: relatedDashboard.getDisplayName(r),
  }));

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(attributeType.sourceKey!, parseInt(e.currentTarget.value, 10));
  };

  return (
    <div>
      <FieldLabel field={field} />
      <select
        id={field.name}
        name={field.name}
        value={value}
        required={field.isRequired}
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
        onChange={handleChange}
      >
        <option value="" />
        {(options || []).map((option: SelectOption) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
