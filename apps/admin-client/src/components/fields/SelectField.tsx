import { DMMF } from '@repo/database';
import { ChangeEvent } from 'react';
import FieldLabel from '../FieldLabel';
import { SelectOption } from '@/config/admin';

interface Props {
  field: DMMF.Field;
  value: string;
  options: SelectOption[];
  onChange: (key: string, value: string) => void;
}
export default function SelectField({
  field,
  value,
  options = [],
  onChange,
}: Props) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(field.name, e.currentTarget.value);
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
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
