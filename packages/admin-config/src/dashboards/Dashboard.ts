import { DMMF } from '@repo/database';
import { AdminAttributeType } from '@repo/types';

export default class Dashboard {
  name: string = '';
  modelName: string = '';
  attributeTypes: AdminAttributeType[] = [];
  collectionAttributes: string[] = [];
  showAttributes: string[] = [];
  createFormAttributes: string[] = [];
  editFormAttributes: string[] = [];
  prismaModel: DMMF.Model = null;

  getDisplayName(record: any): string {
    return record.name;
  }

  isDeletable(record: any): boolean {
    return true;
  }

  isEditable(record: any): boolean {
    return true;
  }

  isCreatable(): boolean {
    return true;
  }

  // Lifecycle hook right before a record is being created through the dashboard.
  async beforeCreate(data: object): Promise<object> {
    return data;
  }
}
