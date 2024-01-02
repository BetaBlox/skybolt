import { DMMF } from "database";
import { ChangeEvent } from "react";
import FieldLabel from "../FieldLabel";

interface Props {
  field: DMMF.Field;
  value: string;
  onChange: (key: string, value: string) => void;
}
export default function StringField({ field, value, onChange }: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(field.name, e.currentTarget.value);
  };

  return (
    <div>
      <FieldLabel field={field} />
      <input
        type="text"
        className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow"
        id={field.name}
        name={field.name}
        value={value || ""}
        required={field.isRequired}
        onChange={handleChange}
      />
    </div>
  );
}