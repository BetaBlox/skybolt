import { FormEvent, useState } from 'react';
// import JsonField from './fields/JsonField';
import { routeWithParams } from '@repo/utils';
import BooleanField from './fields/BooleanField';
import IntegerField from './fields/IntegerField';
import SelectField from './fields/SelectField';
import StringField from './fields/StringField';
import TextField from './fields/TextField';
import PasswordField from './fields/PasswordField';
import RelationshipHasOneField from './fields/RelationshipHasOneField';
import { MODEL_RECORD } from '@/common/routes';
import { useNavigate } from 'react-router-dom';
import {
  AdminAttributeType,
  AdminFieldType,
  AdminModelField,
} from '@repo/types';
import { RecordApi } from '@/api/RecordApi';
import { Button } from './button';
import { useToast } from '@/components/toast/use-toast';

interface Props {
  modelName: string;
  fields: AdminModelField[];
  attributeTypes: AdminAttributeType[];
  formAttributes: string[];
  record: {
    id: number;
    [key: string]: any;
  };
}

export default function UpdateForm({
  modelName,
  fields,
  record: defaultData,
  attributeTypes,
  formAttributes,
}: Props) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [data, setData] = useState(defaultData);
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
      const { response, data: json } = await RecordApi.update(
        modelName,
        data.id,
        payload,
      );

      if (response.ok) {
        toast({
          title: 'Record updated.',
          description: 'Your data has been saved.',
        });
        const showUrl = routeWithParams(MODEL_RECORD, {
          modelName,
          id: json.record.id,
        });
        navigate(showUrl);
      } else {
        toast({
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
        variant: 'destructive',
      });
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
        <hr className="my-10" />
        <Button type="submit" disabled={saving}>
          Submit
        </Button>
        {/* {error && <FormError error={error} />} */}
      </div>
    </form>
  );
}
