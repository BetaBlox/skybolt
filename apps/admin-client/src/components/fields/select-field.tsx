import FieldLabel from './record-field-label';
import { AttributeType, ModelField, SelectOption } from '@repo/types/admin';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select';

interface Props {
  field: ModelField;
  attributeType: AttributeType;
  value: string;
  options: SelectOption[];
  onChange: (key: string, value: string) => void;
}
export default function SelectField({
  field,
  value,
  options = [],
  onChange,
}: Props) {
  return (
    <div>
      <FieldLabel field={field} />
      <div className="mt-2">
        <Select
          // id={field.name}
          name={field.name}
          value={value}
          required={field.isRequired}
          onValueChange={(value: string) => onChange(field.name, value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select one" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
