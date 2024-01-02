import { usePrisma } from "@/usePrisma";
import {
  Field,
  getModel,
  getAttributeType,
  getModelDefaultValues,
  showUrl,
} from "@/config/admin";
import { FormEvent, useState } from "react";
import StringField from "./fields/StringField";
import IntegerField from "./fields/IntegerField";
import TextField from "./fields/TextField";
import BooleanField from "./fields/BooleanField";
import SelectField from "./fields/SelectField";
import RelationshipHasOneField from "./fields/RelationshipHasOneField";
import FormError from "./FormError";
import JsonField from "./fields/JsonField";
import { useNavigate } from "react-router-dom";
import { PrismaContextType } from "@/PrismaProvider";

interface Props {
  modelName: string;
}

export default function CreateForm({ modelName }: Props) {
  const [data, setData] = useState(getModelDefaultValues(modelName));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const modelConfig = getModel(modelName);
  const { getPrismaField } = usePrisma() as PrismaContextType;
  const { formAttributes } = modelConfig;

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setError(null);
    setSaving(true);
    e.preventDefault();
    try {
      const url = `/api/admin/${modelName}`;
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
      })
      const json = await response.json();
      navigate(showUrl(modelName, json));
    // } catch (error) {
    //   console.error(error);
    //   setError(error.response.data.error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: string, value: any) => {
    const newData = {
      ...data,
      [key]: value,
    };

    setData(newData);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="mt-6 border-t border-gray-100 bg-white p-6 shadow-md sm:rounded-lg">
        {formAttributes.map((attribute) => {
          const prismaField = getPrismaField(modelName, attribute);
          const attributeType = getAttributeType(modelName, attribute);

          const defaultFieldProps = {
            field: prismaField,
            value: data[attribute],
            onChange: handleChange,
          };

          return (
            <div key={attributeType.name} className="mb-4">
              {attributeType.type === Field.STRING && (
                <StringField {...defaultFieldProps} />
              )}
              {attributeType.type === Field.TEXT && (
                <TextField {...defaultFieldProps} />
              )}
              {attributeType.type === Field.JSON && (
                <JsonField {...defaultFieldProps} />
              )}
              {attributeType.type === Field.SELECT && (
                <SelectField
                  {...defaultFieldProps}
                  options={attributeType.options || []}
                />
              )}
              {attributeType.type === Field.INTEGER && (
                <IntegerField {...defaultFieldProps} />
              )}
              {attributeType.type === Field.BOOLEAN && (
                <BooleanField {...defaultFieldProps} />
              )}
              {attributeType.type === Field.RELATIONSHIP_HAS_ONE && (
                <RelationshipHasOneField
                  {...defaultFieldProps}
                  value={data[attributeType.sourceKey as string]}
                  modelName={modelName}
                  attribute={attribute}
                  attributeType={attributeType}
                />
              )}
              {/* <p className="text-xs">{JSON.stringify(prismaField, null, 4)}</p> */}
            </div>
          );
        })}
        <button
          type="submit"
          className="rounded bg-indigo-600 px-3 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={saving}
        >
          Submit
        </button>
        {error && <FormError error={error} />}
      </div>
    </form>
  );
}