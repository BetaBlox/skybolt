import { DMMF } from "database";
import { ChangeEvent } from "react";
import FieldLabel from "../FieldLabel";

interface Props {
  field: DMMF.Field;
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
      <textarea
        className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow"
        id={field.name}
        name={field.name}
        rows={5}
        value={value || ""}
        required={field.isRequired}
        onChange={handleChange}
      />
    </div>
  );
}