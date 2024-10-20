import { ChangeEvent } from 'react';
import { AdminModelField } from '@repo/types';
import FieldLabel from '@/components/fields/record-field-label';
import { Input } from '@/components/input';
import { useFieldValidation } from '@/hooks/use-field-validation';
import { FieldErrorMessage } from '@/components/fields/field-error-message';

interface Props {
  field: AdminModelField;
  value: string;
  onChange: (key: string, value: string) => void;
}
export default function UrlField({ field, value, onChange }: Props) {
  const { error, validateField } = useFieldValidation(field, value);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    onChange(field.name, newValue);
    validateField(newValue);
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
        onBlur={() => validateField(value || '')}
      />
      <FieldErrorMessage error={error} />
    </div>
  );
}
