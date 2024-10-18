export type HookConfig<T> = {
  name: string;
  modelName: string;
  beforeCreate: (record: T) => object | Promise<object>;
};
