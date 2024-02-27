import { DMMF } from 'database';
import { ChangeEvent } from 'react';
import FieldLabel from '../FieldLabel';
import { useQuery } from '@tanstack/react-query';
import {
  AdminAttributeType,
  SelectOption,
} from '../../../../admin-api/src/config/admin';
import { routeWithParams } from 'utils';

interface Props {
  field: DMMF.Field;
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
    queryKey: [`hasOne/${modelName}`],
    queryFn: async () => {
      const url = routeWithParams('/api/records/:modelName', { modelName });
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return res.json();
    },
  });

  if (recordsQuery.isPending) return 'Loading...';
  if (recordsQuery.isError || !modelName) return 'Error loading data';

  const data = recordsQuery.data as {
    prismaModelConfig: DMMF.Model;
    attributeTypes: AdminAttributeType[];
    collectionAttributes: string[];
    showAttributes: string[];
    formAttributes: string[];
    // Ignoring for now because we don't have a type for this API payload
    records: any; // eslint-disable-line
  };

  const options: SelectOption[] = data.records.map(
    (r: { id: number; displayName: string }) => ({
      value: r.id,
      label: r.displayName,
    }),
  );

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(attributeType.sourceKey!, parseInt(e.currentTarget.value, 10));
  };

  return (
    <div>
      <FieldLabel field={field} />
      <select
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
        id={field.name}
        name={field.name}
        value={value}
        required={field.isRequired}
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
