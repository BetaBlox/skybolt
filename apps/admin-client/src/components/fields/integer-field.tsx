import { ChangeEvent } from 'react';
import FieldLabel from '../../features/records/record-field-label';
import { AdminModelField } from '@repo/types';
import { Input } from '@/components/input';

interface Props {
  field: AdminModelField;
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
      <Input
        type="number"
        id={field.name}
        name={field.name}
        value={value || ''}
        required={field.isRequired}
        onChange={handleChange}
      />
    </div>
  );
}
