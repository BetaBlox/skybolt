import { DMMF } from "database";
import { ChangeEvent, useEffect, useState } from "react";
import FieldLabel from "../FieldLabel";
import { AdminAttributeType, SelectOption, getModel } from "@/config/admin";

interface Props {
  field: DMMF.Field;
  modelName: string;
  attribute: string;
  attributeType: AdminAttributeType;
  value: string | number;
  onChange: (key: string, value: string | number) => void;
}
export default function RelationshipHasOneField({
  field,
  attribute,
  attributeType,
  value = "",
  onChange,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<SelectOption[]>();

  useEffect(() => {
    async function fetchOptions() {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/${attribute}`)
        const json = await response.json();
        const newOptions = json.map((record) => {
          return {
            value: record.id,
            label: getModel(attributeType.modelName!).getDisplayName(record),
          };
        });

        setOptions(newOptions);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchOptions();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(attributeType.sourceKey!, parseInt(e.currentTarget.value, 10));
  };

  return (
    <div>
      <FieldLabel field={field} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <select
          className="focus:shadow-outline w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow"
          id={field.name}
          name={field.name}
          value={value}
          required={field.isRequired}
          onChange={handleChange}
        >
          <option value="" />
          {(options || []).map((option: SelectOption) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}