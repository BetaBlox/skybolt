export interface Filter {
  modelName: string; // The name of the model the field belongs to
  field: string; // The field to filter by
  operator: string;
  value: string;
  type: string;
}
