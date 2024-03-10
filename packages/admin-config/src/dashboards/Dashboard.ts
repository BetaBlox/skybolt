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
  // Text searchable attributes. Only supports String attribute types
  searchAttributes: string[] = [];
  prismaModel: DMMF.Model = null;

  getDisplayName = (record: any): string => record.name;

  isDeletable = (record: any) => true;
  isEditable = (record: any) => true;
  isCreatable = () => true;
}
