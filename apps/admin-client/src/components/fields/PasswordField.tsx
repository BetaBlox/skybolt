import { ChangeEvent } from 'react';
import FieldLabel from '../record-field-label';
import { AdminModelField } from '@repo/types';
import { Input } from '@/components/Input';

interface Props {
  field: AdminModelField;
  value: string;
  onChange: (key: string, value: string) => void;
}
export default function PasswordField({ field, value, onChange }: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(field.name, e.currentTarget.value);
  };

  return (
    <div>
      <FieldLabel field={field} />
      <Input
        type="password"
        id={field.name}
        name={field.name}
        value={value || ''}
        required={field.isRequired}
        onChange={handleChange}
        autoComplete="none"
      />
    </div>
  );
}
