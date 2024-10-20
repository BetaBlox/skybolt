import FieldLabel from './record-field-label';
import { AdminAttributeType, AdminModelField } from '@repo/types';
import { Switch } from '@/components/switch';

interface Props {
  field: AdminModelField;
  attributeType: AdminAttributeType;
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
      <div className="mt-2">
        <Switch
          id={field.name}
          name={field.name}
          checked={value === true}
          onCheckedChange={(value: boolean) =>
            onChange(field.name, Boolean(value))
          }
        />
      </div>
    </div>
  );
}
