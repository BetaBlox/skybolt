import { ChangeEvent, useState } from 'react';
import {
  AdminAttributeType,
  AdminFieldType,
  AdminModelField,
} from '@repo/types';
import FieldLabel from '@/components/fields/record-field-label';
import { Textarea } from '@/components/textarea';
import { useFieldValidation } from '@/hooks/use-field-validation';
import { FieldErrorMessage } from '@/components/fields/field-error-message';

interface Props {
  field: AdminModelField;
  attributeType: AdminAttributeType;
  value: string;
  onChange: (key: string, value: string) => void;
}
export default function TextField({
  field,
  attributeType,
  value = '',
  onChange,
}: Props) {
  if (attributeType.type !== AdminFieldType.TEXT) {
    throw new Error('Invalid attribute type');
  }

  const { error, validateField } = useFieldValidation(
    field,
    attributeType,
    value,
  );
  const [charCount, setCharCount] = useState<number>(value.length);
  const { maxLength } = attributeType;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.currentTarget.value;
    setCharCount(newValue.length);
    onChange(field.name, newValue);
    validateField(newValue);
  };

  const charsRemaining = () => {
    if (!maxLength || charCount >= maxLength) {
      return 0;
    }

    return maxLength ? maxLength - charCount : null;
  };

  return (
    <div>
      <FieldLabel field={field} />
      <div className="mt-2">
        <Textarea
          id={field.name}
          name={field.name}
          value={value || ''}
          required={field.isRequired}
          onChange={handleChange}
          onBlur={() => validateField(value || '')}
          rows={attributeType.rows || 4}
          aria-invalid={!!error}
        />
        {maxLength && (
          <div className="mt-1 text-right text-sm text-gray-500">
            {charsRemaining()} characters remaining
          </div>
        )}
        <FieldErrorMessage error={error} />
      </div>
    </div>
  );
}
