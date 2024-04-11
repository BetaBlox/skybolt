import { ChangeEvent } from 'react';
import { AdminModelField } from '@repo/types';
import FieldLabel from '@/components/record-field-label';
import { Textarea } from '@/components/Textarea';

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
      <Textarea
        id={field.name}
        name={field.name}
        value={value || ''}
        required={field.isRequired}
        onChange={handleChange}
      />
    </div>
  );
}
