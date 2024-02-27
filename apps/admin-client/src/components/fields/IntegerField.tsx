import { DMMF } from 'database';
import { ChangeEvent } from 'react';
import FieldLabel from '../FieldLabel';

interface Props {
  field: DMMF.Field;
  value: string;
  onChange: (key: string, value: number) => void;
}
export default function IntegerField({ field, value, onChange }: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.currentTarget.value, 10);
    onChange(field.name, value);
  };

  return (
    <div>
      <FieldLabel field={field} />
      <input
        type="number"
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        id={field.name}
        name={field.name}
        value={value || ''}
        required={field.isRequired}
        onChange={handleChange}
      />
    </div>
  );
}
