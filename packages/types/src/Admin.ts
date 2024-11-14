export type SelectOption = { label: string; value: string };

export enum FieldType {
  STRING = 'string',
  TEXT = 'text',
  URL = 'url',
  EMAIL = 'email',
  PASSWORD = 'password',
  BOOLEAN = 'boolean',
  INTEGER = 'int',
  SELECT = 'select',
  JSON = 'json',
  RELATIONSHIP_HAS_ONE = 'relationship_has_one',
  RELATIONSHIP_HAS_MANY = 'relationship_has_many',
  DATE = 'date',
  DATETIME = 'datetime',
  IMAGE = 'image',
}

export enum FilterType {
  TEXT = 'text',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date',
}

export enum FilterOperator {
  EQUALS = 'equals',
  CONTAINS = 'contains',
  STARTS_WITH = 'startsWith',
  ENDS_WITH = 'endsWith',
  GREATER_THAN = 'greaterThan',
  LESS_THAN = 'lessThan',
}

export type AttributeType =
  // Basic types with no additional properties
  | {
      name: string;
      type:
        | FieldType.EMAIL
        | FieldType.URL
        | FieldType.PASSWORD
        | FieldType.BOOLEAN
        | FieldType.INTEGER
        | FieldType.JSON
        | FieldType.DATE
        | FieldType.DATETIME;
    }
  // String type with min and max length
  | {
      name: string;
      type: FieldType.STRING;
      minLength?: number;
      maxLength?: number;
    }
  // Text type with min and max length
  | {
      name: string;
      type: FieldType.TEXT;
      minLength?: number;
      maxLength?: number;
      rows?: number;
    }
  // Select type with options
  | {
      name: string;
      type: FieldType.SELECT;
      options: SelectOption[]; // Required for the SELECT type
    }
  | {
      name: string;
      type: FieldType.IMAGE;
      modelName: string; // The related model's name
      sourceKey: string; // The foreign key id field on this model
    }
  // Has One relationship
  | {
      name: string;
      type: FieldType.RELATIONSHIP_HAS_ONE;
      modelName: string; // The related model's name
      sourceKey: string; // The foreign key id field on this model
      relatedAttributes?: RelatedAttribute[];
    }
  // Has Many relationship
  | {
      name: string;
      type: FieldType.RELATIONSHIP_HAS_MANY;
      modelName: string; // The related model's name
      relationField: string; // The field in the related model
      relatedAttributes?: RelatedAttribute[];
    };

export type HasOneAttributeType = Extract<
  AttributeType,
  { type: FieldType.RELATIONSHIP_HAS_ONE }
>;

export type HasManyAttributeType = Extract<
  AttributeType,
  { type: FieldType.RELATIONSHIP_HAS_MANY }
>;

// Declaration of RelatedAttribute type
export type RelatedAttribute = {
  name: string; // Field name of the related attribute
  type: FieldType; // Data type of the related attribute
};

export type ModelField = {
  name: string;
  isRequired: boolean;
  relationName?: string | null;
};

export interface ModelPayload {
  modelName: string;
  fields: ModelField[];
  count: number;
  // TODO: probably shouldn't mutate the raw data. Maybe a separate displayName lookup hash?
  recentRecords: any[] & {
    displayName: string;
  };
}

export type AdminRecord = Record<string, any> & {
  id: number;
};

export interface RecordsPayload {
  fields: ModelField[];
  modelName: string;
  paginatedResult: PaginatedResult<any>;
}

export interface RecordPayload {
  fields: ModelField[];
  modelName: string;
  record: any;
}

export interface WidgetLayout {
  type: 'row' | 'column'; // Define whether components are placed in a row or column
  heading?: string; // Optional: Heading for the row or column
  components: {
    componentName: string; // The name of the custom component to render
    span: number; // Column widget for the widget on the dashboard page
  }[];
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
