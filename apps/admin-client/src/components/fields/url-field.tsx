import { ChangeEvent } from 'react';
import { AdminModelField } from '@repo/types';
import FieldLabel from '@/features/records/record-field-label';
import { Input } from '@/components/input';

interface Props {
  field: AdminModelField;
  value: string;
  onChange: (key: string, value: string) => void;
}
export default function UrlField({ field, value, onChange }: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(field.name, e.currentTarget.value);
  };

  return (
    <div>
      <FieldLabel field={field} />
      <Input
        type="url"
        id={field.name}
        name={field.name}
        value={value || ''}
        required={field.isRequired}
        onChange={handleChange}
      />
    </div>
  );
}
