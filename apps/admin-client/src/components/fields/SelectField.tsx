import { DMMF } from "database";
import { ChangeEvent } from "react";
import FieldLabel from "../FieldLabel";
import { SelectOption } from "@/config/admin";

interface Props {
  field: DMMF.Field;
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
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(field.name, e.currentTarget.value);
  };

  return (
    <div>
      <FieldLabel field={field} />
      <select
        className="focus:shadow-outline w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow"
        id={field.name}
        name={field.name}
        value={value}
        required={field.isRequired}
        onChange={handleChange}
      >
        <option value="" />
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}