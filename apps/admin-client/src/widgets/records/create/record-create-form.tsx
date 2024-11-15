import { FormEvent, useState } from 'react';
import { routeWithParams } from '@repo/utils';
import { useNavigate } from 'react-router-dom';
import { MODEL_RECORD } from '@/common/routes';
import { AttributeType, FieldType, ModelField } from '@repo/types/admin';
import { RecordApi, RecordCreatePayload } from '@/api/RecordApi';
import { useToast } from '@/components/toast/use-toast';
import UrlField from '@/components/fields/url-field';
import DateField from '@/components/fields/date-field';
import StringField from '@/components/fields/string-field';
import BooleanField from '@/components/fields/boolean-field';
import RelationshipHasOneField from '@/components/fields/has-one-field';
import IntegerField from '@/components/fields/integer-field';
import PasswordField from '@/components/fields/password-field';
import SelectField from '@/components/fields/select-field';
import TextField from '@/components/fields/text-field';
import { Button } from '@/components/button';
import EmailField from '@/components/fields/email-field';
import ImageField from '@/components/fields/image-field';
import { Spinner } from '@/components/spinner';
import { Dashboard, getDashboard } from '@repo/admin-config';

interface Props {
  modelName: string;
  fields: ModelField[];
  attributeTypes: AttributeType[];
  formAttributes: string[];
}

export default function RecordCreateForm({
  modelName,
  fields,
  attributeTypes,
  formAttributes,
}: Props) {
  const dashboard = getDashboard(modelName);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [data, setData] = useState({});
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setSaving(true);
    e.preventDefault();

    const payload = filterPayload(data, dashboard);

    try {
      const createdRecordPayload = await RecordApi.create(modelName, payload);

      toast({
        title: 'Record created.',
        description: 'Your data has been saved.',
      });
      const showUrl = routeWithParams(MODEL_RECORD, {
        modelName,
        id: createdRecordPayload.record.id,
      });
      navigate(showUrl);
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

  const handleChange = (
    key: string,
    value: string | number | boolean | File | null,
  ) => {
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
            attributeType,
            value: data[attribute],
            onChange: handleChange,
          };

          return (
            <div key={attributeType.name} className="mb-4">
              {attributeType.type === FieldType.STRING && (
                <StringField {...defaultFieldProps} />
              )}
              {attributeType.type === FieldType.TEXT && (
                <TextField {...defaultFieldProps} />
              )}
              {attributeType.type === FieldType.EMAIL && (
                <EmailField {...defaultFieldProps} />
              )}
              {attributeType.type === FieldType.URL && (
                <UrlField {...defaultFieldProps} />
              )}
              {attributeType.type === FieldType.PASSWORD && (
                <PasswordField {...defaultFieldProps} />
              )}
              {attributeType.type === FieldType.DATE && (
                <DateField {...defaultFieldProps} />
              )}
              {/* {attributeType.type === FieldType.JSON && (
                <JsonField {...defaultFieldProps} />
              )} */}
              {attributeType.type === FieldType.SELECT && (
                <SelectField
                  {...defaultFieldProps}
                  options={attributeType.options || []}
                />
              )}
              {attributeType.type === FieldType.INTEGER && (
                <IntegerField {...defaultFieldProps} />
              )}
              {attributeType.type === FieldType.BOOLEAN && (
                <BooleanField {...defaultFieldProps} />
              )}
              {attributeType.type === FieldType.IMAGE && (
                <ImageField {...defaultFieldProps} asset={null} />
              )}
              {attributeType.type === FieldType.RELATIONSHIP_HAS_ONE && (
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
          {saving ? <Spinner /> : 'Submit'}
        </Button>
        {/* {error && <FormError error={error} />} */}
      </div>
    </form>
  );
}

const filterPayload = (
  data: object,
  dashboard: Dashboard<unknown>,
): RecordCreatePayload => {
  const result = {};
  const keys = Object.keys(data);

  keys
    .filter((key) => {
      // Include and directly creatable fields from our create form defintion
      if (dashboard.createFormAttributes.includes(key)) {
        return true;
      }

      // Hack to make hasOne relationships still work. Really we need to rework the definition type
      const hasOneAttr = dashboard.attributeTypes.find(
        (attributeType: AttributeType) =>
          attributeType.name === key.replace('Id', ''),
      );
      // Include include related source keys to any hasOne relationships
      if (
        hasOneAttr?.type === FieldType.RELATIONSHIP_HAS_ONE &&
        hasOneAttr.sourceKey === key
      ) {
        return true;
      }

      return false;
    })
    .forEach((key) => {
      result[key] = data[key];
    });

  return result;
};
