import { DMMF } from "database";
import { ChangeEvent } from "react";
import FieldLabel from "../FieldLabel";

interface Props {
  field: DMMF.Field;
  value: string;
  onChange: (key: string, value: number) => void;
}
export default function IntegerField({ field, value, onChange }: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.currentTarget.value, 10);
    onChange(field.name, value);
  };

  return (
    <div>
      <FieldLabel field={field} />
      <input
        type="number"
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