import { ChangeEvent } from 'react';
import FieldLabel from './record-field-label';
import { AttributeType, ModelField } from '@repo/types/admin';
import { Input } from '@/components/input';
import { useFieldValidation } from '@/hooks/use-field-validation';
import { FieldErrorMessage } from '@/components/fields/field-error-message';

interface Props {
  field: ModelField;
  attributeType: AttributeType;
  value: string;
  onChange: (key: string, value: string) => void;
}
export default function PasswordField({
  field,
  attributeType,
  value,
  onChange,
}: Props) {
  const { error, validateField } = useFieldValidation(
    field,
    attributeType,
    value,
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    onChange(field.name, newValue);
    validateField(newValue);
  };

  return (
    <div>
      <FieldLabel field={field} />
      <div className="mt-2">
        <Input
          type="password"
          id={field.name}
          name={field.name}
          value={value || ''}
          required={field.isRequired}
          onChange={handleChange}
          autoComplete="none"
          onBlur={() => validateField(value || '')}
          aria-invalid={!!error}
        />
        <FieldErrorMessage error={error} />
      </div>
    </div>
  );
}
