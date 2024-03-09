import { getAttributeType, getModel } from '@repo/admin-config';
import { AdminFieldType } from '@repo/types';

interface Props {
  record: any;
  modelName: string;
  attribute: string;
}
export default function ShowViewField({ record, modelName, attribute }: Props) {
  const attributeType = getAttributeType(modelName, attribute);
  const { type } = attributeType;
  const value = record[attributeType.name];

  if (type === AdminFieldType.JSON) {
    return JSON.stringify(value, null, 2);
  } else if (type === AdminFieldType.BOOLEAN) {
    return value === true ? 'yes' : 'no';
  } else if (type === AdminFieldType.RELATIONSHIP_HAS_ONE) {
    // Should we even be using modelName here? Shouldn't we simply use the attributeType.name
    const relationshipModelName = attributeType.modelName!;
    const relationshipRecord =
      record[relationshipModelName] || record[attributeType.name];

    if (!relationshipRecord) {
      throw new Error(
        "No relationship record found on your model. Did you forget to 'include' it with your query?",
      );
    }

    const { getDisplayName } = getModel(relationshipModelName);
    return getDisplayName(relationshipRecord) as string;
  } else {
    return record[attributeType.name];
  }
}
