import { DMMF } from "database";
import { ChangeEvent } from "react";
import FieldLabel from "../FieldLabel";

interface Props {
  field: DMMF.Field;
  value: boolean;
  onChange: (key: string, value: boolean) => void;
}
export default function BooleanField({
  field,
  value = false,
  onChange,
}: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(field.name, Boolean(e.currentTarget.checked));
  };

  return (
    <div>
      <FieldLabel field={field} required={false} />
      <input
        type="checkbox"
        className="focus:ring-blue-500focus:ring-2 h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600"
        id={field.name}
        name={field.name}
        checked={value === true}
        onChange={handleChange}
      />
    </div>
  );
}