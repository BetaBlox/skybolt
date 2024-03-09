export type SelectOption = { label: string; value: string };

export const enum AdminFieldType {
  STRING = 'string',
  TEXT = 'text',
  PASSWORD = 'password',
  BOOLEAN = 'boolean',
  INTEGER = 'int',
  SELECT = 'select',
  JSON = 'json',
  RELATIONSHIP_HAS_ONE = 'relationship_has_one',
  DATETIME = 'datetime',
}

export type AdminAttributeType = {
  name: string;
  type: AdminFieldType;
  options?: SelectOption[];
  modelName?: string;
  sourceKey?: string;
  defaultValue?: any;
};

export interface AdminModelPayload {
  prismaModel: any;
  modelName: string;
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
  prismaModel: any;
  modelName: string;
  records: any[];
}

export interface AdminRecordPayload {
  prismaModel: any;
  modelName: string;
  record: any;
}
