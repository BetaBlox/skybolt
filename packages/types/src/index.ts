/**
 * App
 */
export type MySharedType = {};

/**
 * Admin
 */

export type SelectOption = { label: string; value: string };

export const enum AdminFieldType {
  STRING = 'string',
  TEXT = 'text',
  PASSWORD = 'password',
  BOOLEAN = 'boolean',
  INTEGER = 'int',
  SELECT = 'select',
  JSON = 'json', // Not currently used
  RELATIONSHIP_HAS_ONE = 'relationship_has_one',
  DATETIME = 'datetime',
}

export type AdminModel = {
  getDisplayName: (record: any) => string | number;
  attributeTypes: AdminAttributeType[];
  collectionAttributes: string[];
  showAttributes: string[];
  formAttributes: string[];
};

export type AdminConfig = {
  models: { [key: string]: AdminModel };
};

export type AdminAttributeType = {
  name: string;
  type: AdminFieldType;
  options?: SelectOption[];
  modelName?: string;
  sourceKey?: string;
  defaultValue?: any;
};

export interface AdminModelPayload {
  prismaModelConfig: any;
  attributeTypes: AdminAttributeType[];
  collectionAttributes: string[];
  showAttributes: string[];
  formAttributes: string[];
  count: number;
  // TODO: probably shouldn't mutate the raw data. Maybe a separate displayName lookup hash?
  recentRecords: any[] & {
    displayName: string;
  };
  // TODO: probably shouldn't mutate the raw data. Maybe a separate displayName lookup hash?
  records: any[] & {
    displayName: string;
  };
}

export interface AdminRecordsPayload {
  prismaModelConfig: any;
  attributeTypes: AdminAttributeType[];
  collectionAttributes: string[];
  showAttributes: string[];
  formAttributes: string[];
  // TODO: probably shouldn't mutate the raw data. Maybe a separate displayName lookup hash?
  records: any[] & {
    displayName: string;
  };
}

export interface AdminRecordPayload {
  prismaModelConfig: any;
  attributeTypes: AdminAttributeType[];
  collectionAttributes: string[];
  showAttributes: string[];
  formAttributes: string[];
  record: any;
  displayName: string;
}
