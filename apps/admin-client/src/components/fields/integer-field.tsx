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
  onChange: (key: string, value: number) => void;
}
export default function IntegerField({
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
    const newValue = parseInt(e.currentTarget.value, 10);
    onChange(field.name, newValue);
    validateField(newValue);
  };

  return (
    <div>
      <FieldLabel field={field} />
      <div className="mt-2">
        <Input
          type="number"
          id={field.name}
          name={field.name}
          value={value || ''}
          required={field.isRequired}
          onChange={handleChange}
          onBlur={() => validateField(value || '')}
          aria-invalid={!!error}
        />
        <FieldErrorMessage error={error} />
      </div>
    </div>
  );
}
