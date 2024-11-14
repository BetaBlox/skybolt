/**
 * Hooks allow you to define custom logic that should run at specific points in the lifecycle of a model's record
 * (e.g., beforeCreate, beforeDelete). This separation helps organize custom business logic while keeping it
 * clean and reusable.
 *
 * Each model can have its own hooks file where specific logic is implemented, ensuring a clear separation of concerns.
 */
import { HookConfig } from './hook.types';
import { UserHooks } from './definitions/user.hooks';

export function getHookConfigs(): HookConfig<any>[] {
  return [UserHooks];
}

export function getHookConfig(modelName: string): HookConfig<unknown> {
  const hookConfigs = getHookConfigs();
  const hookConfig = hookConfigs.find(
    (d) => d.modelName.toLowerCase() === modelName.toLowerCase(),
  );

  const defaultHookConfig: HookConfig<unknown> = {
    name: modelName,
    modelName,
    beforeCreate: async (record: unknown) => record,
    beforeUpdate: async (record: unknown) => record,
    beforeDelete: async (record: unknown) => record,
  };

  return {
    ...defaultHookConfig,
    ...hookConfig,
    beforeCreate: hookConfig?.beforeCreate ?? defaultHookConfig.beforeCreate,
    beforeUpdate: hookConfig?.beforeUpdate ?? defaultHookConfig.beforeUpdate,
    beforeDelete: hookConfig?.beforeDelete ?? defaultHookConfig.beforeDelete,
  };
}
