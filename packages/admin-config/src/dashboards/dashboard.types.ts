import { AdminAttributeType, AdminWidgetLayout } from '@repo/types';

export interface Dashboard<T> {
  pinnedOnHome: boolean;
  name: string;
  modelName: string;
  attributeTypes: AdminAttributeType[];
  collectionAttributes: string[];
  collectionFilterAttributes: string[];
  showAttributes: string[];
  createFormAttributes: string[];
  editFormAttributes: string[];
  // Text searchable attributes. Only supports String attribute types
  searchAttributes: string[];

  getDisplayName: (record: T) => string;
  isDeletable: (record: T) => boolean;
  isEditable: (record: T) => boolean;
  isCreatable: () => boolean;

  // New field for custom component layouts on the records show page
  showPageWidgets?: AdminWidgetLayout[]; // Optional field to define layout and custom components
}
