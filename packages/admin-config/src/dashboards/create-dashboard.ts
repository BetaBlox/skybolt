import { Dashboard } from './dashboard.types';

export function createDashboard<T>(
  config: Partial<Dashboard<T>> & {
    name: string;
    modelName: string;
    getDisplayName: (record: T) => string;
  },
): Dashboard<T> {
  return {
    pinnedOnHome: config.pinnedOnHome || false,
    attributeTypes: config.attributeTypes || [],
    collectionAttributes: config.collectionAttributes || [],
    collectionFilterAttributes: config.collectionFilterAttributes || [],
    showAttributes: config.showAttributes || [],
    createFormAttributes: config.createFormAttributes || [],
    editFormAttributes: config.editFormAttributes || [],
    searchAttributes: config.searchAttributes || [],
    isDeletable: config.isDeletable || (() => true),
    isEditable: config.isEditable || (() => true),
    isCreatable: config.isCreatable || (() => true),
    showPageWidgets: [
      {
        type: 'row',
        components: [{ componentName: 'RecordDetailsCard', span: 12 }],
      },
    ],
    ...config,
  };
}
