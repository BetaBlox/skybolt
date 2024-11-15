import { Color } from '@repo/database';
import { FieldType } from '@repo/types/admin';
import { createDashboard } from '../create-dashboard';

export const ColorDashboard = createDashboard<Color>({
  name: 'Color',
  modelName: 'Color',

  getDisplayName: (record: Color) => record.label,

  attributeTypes: [
    { name: 'label', type: FieldType.STRING },
    { name: 'hex', type: FieldType.STRING },
    { name: 'createdAt', type: FieldType.DATETIME },
    { name: 'updatedAt', type: FieldType.DATETIME },
  ],

  collectionAttributes: ['label', 'hex', 'createdAt', 'updatedAt'],
  collectionFilterAttributes: [],
  showAttributes: ['label', 'hex', 'createdAt', 'updatedAt'],
  createFormAttributes: ['label', 'hex'],
  editFormAttributes: ['label', 'hex'],

  // Text searchable attributes. Only supports String attribute types
  searchAttributes: ['label'],
});
