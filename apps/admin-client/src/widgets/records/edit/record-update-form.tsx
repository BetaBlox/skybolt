import { FormEvent, useState } from 'react';
import { routeWithParams } from '@repo/utils';
import { MODEL_RECORD } from '@/common/routes';
import { useNavigate } from 'react-router-dom';
import {
  AttributeType,
  FieldType,
  ModelField,
  AdminRecord,
} from '@repo/types/admin';
import { RecordApi } from '@/api/RecordApi';
import { useToast } from '@/components/toast/use-toast';
import BooleanField from '@/components/fields/boolean-field';
import DateField from '@/components/fields/date-field';
import RelationshipHasOneField from '@/components/fields/has-one-field';
import IntegerField from '@/components/fields/integer-field';
import PasswordField from '@/components/fields/password-field';
import SelectField from '@/components/fields/select-field';
import StringField from '@/components/fields/string-field';
import TextField from '@/components/fields/text-field';
import UrlField from '@/components/fields/url-field';
import { Button } from '@/components/button';
import EmailField from '@/components/fields/email-field';
import ImageField from '@/components/fields/image-field';
import { Spinner } from '@/components/spinner';
import { Dashboard, getDashboard } from '@repo/admin-config';
import { Asset } from '@repo/database';

type AdminRecordAssets = {
  [key: string]: {
    asset: Asset | null;
    action: 'create' | 'delete' | 'none';
    file: File | null;
  };
};

interface Props {
  modelName: string;
  fields: ModelField[];
  attributeTypes: AttributeType[];
  formAttributes: string[];
  record: AdminRecord;
}

export default function RecordUpdateForm({
  modelName,
  fields,
  record,
  attributeTypes,
  formAttributes,
}: Props) {
  const dashboard = getDashboard(modelName);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jsonData, setJsonData] = useState(
    getDefaultData(record, dashboard).json,
  );
  const [assetData, setAssetData] = useState<AdminRecordAssets>(
    getDefaultData(record, dashboard).assets,
  );
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setSaving(true);
    e.preventDefault();

    try {
      const updatedRecordPayload = await RecordApi.update(
        modelName,
        record,
        jsonData,
        assetData,
      );

      toast({
        title: 'Record updated.',
        description: 'Your data has been saved.',
      });
      const showUrl = routeWithParams(MODEL_RECORD, {
        modelName,
        id: updatedRecordPayload.record.id,
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
    const isJsonField = !!jsonData[key];
    const isAssetField = !!assetData[key];

    if (!isJsonField && !isAssetField) {
      throw new Error(
        `Field ${key} is not found in the json or asset data object.`,
      );
    }

    if (isAssetField && value === null) {
      setAssetData({
        ...assetData,
        [key]: {
          ...assetData[key],
          action: 'delete',
          file: null,
        },
      });
    } else if (isAssetField && value instanceof File) {
      setAssetData({
        ...assetData,
        [key]: {
          ...assetData[key],
          action: 'create',
          file: value,
        },
      });
    } else if (isJsonField) {
      setJsonData({
        ...jsonData,
        [key]: value,
      });
    }
  };

  console.log('jsonData', jsonData);
  console.log('assetData', assetData);

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
            value: jsonData[attribute],
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
                <ImageField
                  {...defaultFieldProps}
                  asset={assetData[attribute].asset}
                />
              )}
              {attributeType.type === FieldType.RELATIONSHIP_HAS_ONE && (
                <RelationshipHasOneField
                  {...defaultFieldProps}
                  value={jsonData[attributeType.sourceKey as string]}
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

function getDefaultData(
  data: AdminRecord,
  dashboard: Dashboard<unknown>,
): {
  json: AdminRecord;
  assets: AdminRecordAssets;
} {
  const json: AdminRecord = {
    id: data.id,
  };
  const assets: AdminRecordAssets = {};
  const editableKeys = Object.keys(data).filter((key) => {
    const attrType = dashboard.attributeTypes.find(
      (attributeType: AttributeType) => attributeType.name === key,
    );

    // Include and directly editable fields from our edit form defintion
    if (dashboard.editFormAttributes.includes(key)) {
      return true;
    }

    // Include include related source keys to any hasOne relationships
    if (
      attrType?.type === FieldType.RELATIONSHIP_HAS_ONE &&
      attrType.sourceKey === key
    ) {
      return true;
    }

    return false;
  });

  // Separate json data from file asset data
  editableKeys.forEach((key) => {
    const value = data[key];
    const attributeType = dashboard.attributeTypes.find(
      (attributeType: AttributeType) => attributeType.name === key,
    );

    if (!attributeType) {
      throw new Error(`Attribute ${key} not found in the dashboard.`);
    }

    const isFileAttribute = attributeType.type === FieldType.IMAGE;
    const isJsonData = !isFileAttribute;

    if (isFileAttribute) {
      assets[key] = {
        asset: value,
        action: 'none',
        file: null,
      };
    } else if (isJsonData) {
      json[key] = value;
    }
  });

  return {
    json,
    assets,
  };
}
