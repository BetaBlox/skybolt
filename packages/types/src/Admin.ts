export type SelectOption = { label: string; value: string };

export enum AdminFieldType {
  STRING = 'string',
  TEXT = 'text',
  PASSWORD = 'password',
  BOOLEAN = 'boolean',
  INTEGER = 'int',
  SELECT = 'select',
  JSON = 'json',
  RELATIONSHIP_HAS_ONE = 'relationship_has_one',
  RELATIONSHIP_HAS_MANY = 'relationship_has_many',
  DATETIME = 'datetime',
}

export enum AdminFilterType {
  TEXT = 'text',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date',
}

export enum AdminFilterOperator {
  EQUALS = 'equals',
  CONTAINS = 'contains',
  STARTS_WITH = 'startsWith',
  ENDS_WITH = 'endsWith',
  GREATER_THAN = 'greaterThan',
  LESS_THAN = 'lessThan',
}

// Attribute type for each field in your model
export type AdminAttributeType = {
  name: string;
  type: AdminFieldType;
  options?: SelectOption[];
  modelName?: string; // Model name for has one and has many relationships
  sourceKey?: string; // For has one relationships
  relationField?: string; // For has many relationships
  defaultValue?: any;
  relatedAttributes?: RelatedAttribute[]; // Include relatedAttributes property here
};

// Declaration of RelatedAttribute type
export type RelatedAttribute = {
  name: string; // Field name of the related attribute
  type: AdminFieldType; // Data type of the related attribute
};

export type AdminModelField = {
  name: string;
  isRequired: boolean;
  relationName?: string | null;
};

export interface AdminModelPayload {
  modelName: string;
  fields: AdminModelField[];
  count: number;
  // TODO: probably shouldn't mutate the raw data. Maybe a separate displayName lookup hash?
  recentRecords: any[] & {
    displayName: string;
  };
}

export interface AdminRecordsPayload {
  fields: AdminModelField[];
  modelName: string;
  paginatedResult: PaginatedResult<any>;
}

export interface AdminRecordPayload {
  fields: AdminModelField[];
  modelName: string;
  record: any;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

export type PaginateOptions = {
  page?: number | string;
  perPage?: number | string;
};
export type PaginateFunction = <T, K>(
  model: any,
  args?: K,
  options?: PaginateOptions,
) => Promise<PaginatedResult<T>>;
