import FieldLabel from '../record-field-label';
import { AdminModelField } from '@repo/types';
import { Switch } from '@/components/Switch';

interface Props {
  field: AdminModelField;
  value: boolean;
  onChange: (key: string, value: boolean) => void;
}
export default function BooleanField({
  field,
  value = false,
  onChange,
}: Props) {
  return (
    <div>
      <FieldLabel field={field} required={false} />
      <Switch
        id={field.name}
        name={field.name}
        checked={value === true}
        onCheckedChange={(value: boolean) =>
          onChange(field.name, Boolean(value))
        }
      />
    </div>
  );
}
