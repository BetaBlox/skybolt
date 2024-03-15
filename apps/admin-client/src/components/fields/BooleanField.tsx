import { ChangeEvent } from 'react';
import FieldLabel from '../FieldLabel';
import { AdminModelField } from '@repo/types';

interface Props {
  field: AdminModelField;
  value: boolean;
  onChange: (key: string, value: boolean) => void;
}
export default function BooleanField({
  field,
  value = false,
  onChange,
}: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(field.name, Boolean(e.currentTarget.checked));
  };

  return (
    <div>
      <FieldLabel field={field} required={false} />
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
        id={field.name}
        name={field.name}
        checked={value === true}
        onChange={handleChange}
      />
    </div>
  );
}
