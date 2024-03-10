import { Color } from '@repo/database';
import { AdminFieldType } from '@repo/types';
import Dashboard from './Dashboard';

export class ColorDashboard extends Dashboard {
  name = 'Color';
  modelName = 'Color';

  getDisplayName = (record: Color): string => record.label;
  attributeTypes = [
    { name: 'label', type: AdminFieldType.STRING },
    { name: 'hex', type: AdminFieldType.STRING },
    { name: 'createdAt', type: AdminFieldType.DATETIME },
    { name: 'updatedAt', type: AdminFieldType.DATETIME },
  ];
  collectionAttributes = ['label', 'hex', 'createdAt', 'updatedAt'];
  showAttributes = ['label', 'hex', 'createdAt', 'updatedAt'];
  createFormAttributes = ['label', 'hex'];
  editFormAttributes = ['label', 'hex'];

  // isDeletable = (record: Color) => false;
  isEditable = (record: Color) => false;
  isCreatable = () => false;
}
