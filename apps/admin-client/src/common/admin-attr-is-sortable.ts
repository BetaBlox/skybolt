import { Dashboard } from '@repo/admin-config';
import { AdminFieldType } from '@repo/types';

export const attrIsSortable = (
  attribute: string,
  dashboard: Dashboard<unknown>,
) => {
  // id is always sortable even though we don't have
  // people declare a attribute config in the admin dashboards
  if (attribute === 'id') {
    return true;
  }

  const attrType = dashboard.attributeTypes.find(
    (attrType) => attrType.name === attribute,
  );

  // Do not sort if the attribute is a relationship. We can only sort by the fields of the current model
  if (
    attrType?.type === AdminFieldType.RELATIONSHIP_HAS_ONE ||
    attrType?.type === AdminFieldType.RELATIONSHIP_HAS_MANY
  ) {
    return false;
  }

  return true;
};
