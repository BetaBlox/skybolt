import { FormEvent, useState } from 'react';
// import JsonField from './fields/JsonField';
import { routeWithParams } from '@repo/utils';
import BooleanField from './fields/BooleanField';
import IntegerField from './fields/IntegerField';
import SelectField from './fields/SelectField';
import StringField from './fields/StringField';
import TextField from './fields/TextField';
import { Notify } from '@/config/notification/notification.service';
import PasswordField from './fields/PasswordField';
import RelationshipHasOneField from './fields/RelationshipHasOneField';
import { useNavigate } from 'react-router-dom';
import { MODEL_RECORD } from '@/common/routes';
import {
  AdminAttributeType,
  AdminFieldType,
  AdminModelField,
} from '@repo/types';
import { RecordApi } from '@/api/RecordApi';
// import { getDashboard } from '@repo/admin-config';

interface Props {
  modelName: string;
  fields: AdminModelField[];
  attributeTypes: AdminAttributeType[];
  formAttributes: string[];
}

export default function CreateForm({
  modelName,
  fields,
  attributeTypes,
  formAttributes,
}: Props) {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [saving, setSaving] = useState(false);

  // const dashboard = getDashboard(modelName);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setSaving(true);
    e.preventDefault();

    const payload = {};

    // Filter out non supported parameters for submit
    Object.keys(data)
      .filter(
        (key) =>
          formAttributes.includes(key) ||
          formAttributes.includes(key.replace('Id', '')), // Hack to still support relationship fields like authorId -> author
      )
      .forEach((key) => (payload[key] = data[key]));

    try {
      const { response, data: json } = await RecordApi.create(
        modelName,
        payload,
      );

      if (response.ok) {
        Notify.success();
        const showUrl = routeWithParams(MODEL_RECORD, {
          modelName,
          id: json.record.id,
        });
        navigate(showUrl);
      } else {
        Notify.error();
      }
    } catch (error) {
      console.error(error);
      Notify.error();
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
          const attributeType = attributeTypes.find(
            (at) => at.name === attribute,
          );

          const field = fields.find(
            (f) => f.name.toLowerCase() === attribute.toLowerCase(),
          );

          if (!attributeType) {
            throw new Error(
              `error locating attribute type model: ${modelName} attribute: ${attribute}`,
            );
          }

          if (!field) {
            throw new Error(
              `error locating prisma field type model: ${modelName} attribute: ${attribute}`,
            );
          }

          const defaultFieldProps = {
            field: field,
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
