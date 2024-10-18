export type HookConfig<T> = {
  name: string;
  modelName: string;
  beforeCreate?: (record: T) => object | Promise<object>;
  beforeUpdate?: (record: T) => object | Promise<object>;
  beforeDelete?: (record: T) => object | Promise<object>;
};
