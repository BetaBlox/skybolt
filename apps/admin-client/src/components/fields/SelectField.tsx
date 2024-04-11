import FieldLabel from '../FieldLabel';
import { AdminModelField, SelectOption } from '@repo/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/Select';

interface Props {
  field: AdminModelField;
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
  );
}
