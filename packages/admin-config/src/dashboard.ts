import { AdminAttributeType } from '@repo/types';

export interface Dashboard<T> {
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
  beforeCreate: (data: object) => object;
}

// Extendable options used when creating a dashboard
export type DashboardOptions<T> = {
  name: string;
  modelName: string;
  attributeTypes: AdminAttributeType[];
  collectionAttributes: string[];
  collectionFilterAttributes: string[];
  showAttributes: string[];
  createFormAttributes: string[];
  editFormAttributes: string[];
  // Text searchable attributes. Only supports String attribute types
  searchAttributes?: string[];

  getDisplayName: (record: T) => string;
  isDeletable?: (record: T) => boolean;
  isEditable?: (record: T) => boolean;
  isCreatable?: () => boolean;
  beforeCreate?: (data: object) => object;
};

/**
 * Creates an admin dashboard from your configuration options merged
 * with standard dashboard default values
 */
export function createDashboard<T>(options: DashboardOptions<T>): Dashboard<T> {
  return {
    isDeletable: () => true,
    isEditable: () => true,
    isCreatable: () => true,
    beforeCreate: (data: object) => data,
    searchAttributes: [],
    ...options,
  };
}
