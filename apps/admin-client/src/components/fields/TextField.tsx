import { ChangeEvent } from 'react';
import FieldLabel from '../FieldLabel';
import { AdminModelField } from '@repo/types';

interface Props {
  field: AdminModelField;
  value: string;
  onChange: (key: string, value: string) => void;
}
export default function TextField({ field, value, onChange }: Props) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(field.name, e.currentTarget.value);
  };

  return (
    <div>
      <FieldLabel field={field} />
      <textarea
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        id={field.name}
        name={field.name}
        rows={5}
        value={value || ''}
        required={field.isRequired}
        onChange={handleChange}
      />
    </div>
  );
}
