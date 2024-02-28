import { FormEvent, useState } from 'react';
// import JsonField from './fields/JsonField';
import { routeWithParams } from '@repo/utils';
import { DMMF } from '@repo/database';
import BooleanField from './fields/BooleanField';
import IntegerField from './fields/IntegerField';
import SelectField from './fields/SelectField';
import StringField from './fields/StringField';
import TextField from './fields/TextField';
import { Notify } from '@/config/notification/notification.service';
import PasswordField from './fields/PasswordField';
import RelationshipHasOneField from './fields/RelationshipHasOneField';
import { MODEL_RECORD } from '@/common/routes';
import { useNavigate } from 'react-router-dom';
import { AdminAttributeType, AdminFieldType } from '@repo/types';

interface Props {
  modelName: string;
  prismaModelConfig: DMMF.Model;
  attributeTypes: AdminAttributeType[];
  formAttributes: string[];
  record: {
    id: number;
    [key: string]: any;
  };
}

export default function UpdateForm({
  modelName,
  record: defaultData,
  prismaModelConfig,
  attributeTypes,
  formAttributes,
}: Props) {
  const navigate = useNavigate();
  const [data, setData] = useState(defaultData);
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setSaving(true);
    e.preventDefault();

    try {
      const url = routeWithParams('/api/records/:modelName/:id', {
        modelName,
        id: String(data.id),
      });
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        Notify.success();
        const json = await res.json();
        const showUrl = routeWithParams(MODEL_RECORD, {
          modelName,
          id: json.record.id,
        });
        navigate(showUrl);
      } else {
        Notify.error();
      }
    } catch (error) {
      Notify.error();
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: string, value: any) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="mt-6 border-t border-gray-100 bg-white p-6 shadow-md sm:rounded-lg">
        {formAttributes.map((attribute) => {
          const attributeType = attributeTypes.find(
            (at) => at.name === attribute,
          );
          const prismaField = prismaModelConfig?.fields.find(
            (f) => f.name.toLowerCase() === attribute.toLowerCase(),
          ) as DMMF.Field;

          if (!attributeType) {
            throw new Error(
              `error locating attribute type model: ${modelName} attribute: ${attribute}`,
            );
          }

          if (!prismaField) {
            throw new Error(
              `error locating prisma field type model: ${modelName} attribute: ${attribute}`,
            );
          }

          const defaultFieldProps = {
            field: prismaField,
            value: data[attribute],
            onChange: handleChange,
          };

          return (
            <div key={attributeType.name} className="mb-4">
              {attributeType.type === AdminFieldType.STRING && (
                <StringField {...defaultFieldProps} />
              )}
              {attributeType.type === AdminFieldType.PASSWORD && (
                <PasswordField {...defaultFieldProps} />
              )}
              {attributeType.type === AdminFieldType.TEXT && (
                <TextField {...defaultFieldProps} />
              )}
              {/* {attributeType.type === AdminFieldType.JSON && (
                <JsonField {...defaultFieldProps} />
              )} */}
              {attributeType.type === AdminFieldType.SELECT && (
                <SelectField
                  {...defaultFieldProps}
                  options={attributeType.options || []}
                />
              )}
              {attributeType.type === AdminFieldType.INTEGER && (
                <IntegerField {...defaultFieldProps} />
              )}
              {attributeType.type === AdminFieldType.BOOLEAN && (
                <BooleanField {...defaultFieldProps} />
              )}
              {attributeType.type === AdminFieldType.RELATIONSHIP_HAS_ONE && (
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
        {/* {error && <FormError error={error} />} */}
      </div>
    </form>
  );
}
