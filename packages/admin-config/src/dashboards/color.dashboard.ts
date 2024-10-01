import { Color } from '@repo/database';
import { AdminFieldType } from '@repo/types';
import { Dashboard, createDashboard } from '../dashboard';

export function createColorDashboard(): Dashboard<Color> {
  return createDashboard<Color>({
    name: 'Color',
    modelName: 'Color',
    getDisplayName: (record: Color) => record.label,
    attributeTypes: [
      { name: 'label', type: AdminFieldType.STRING },
      { name: 'hex', type: AdminFieldType.STRING },
      { name: 'createdAt', type: AdminFieldType.DATETIME },
      { name: 'updatedAt', type: AdminFieldType.DATETIME },
    ],
    collectionAttributes: ['label', 'hex', 'createdAt', 'updatedAt'],
    collectionFilterAttributes: [],
    showAttributes: ['label', 'hex', 'createdAt', 'updatedAt'],
    createFormAttributes: ['label', 'hex'],
    editFormAttributes: ['label', 'hex'],

    // Text searchable attributes. Only supports String attribute types
    searchAttributes: ['label'],
  });
}
