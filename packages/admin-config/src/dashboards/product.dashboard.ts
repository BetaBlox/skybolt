import { Product, User } from '@repo/database';
import { AdminFieldType } from '@repo/types';
import { Dashboard, createDashboard } from '../dashboard';

export function createProductDashboard(): Dashboard<Product> {
  return createDashboard<Product>({
    pinnedOnHome: true,
    name: 'Product',
    modelName: 'Product',

    getDisplayName: (record: Product): string => record.name,

    attributeTypes: [
      { name: 'name', type: AdminFieldType.STRING },
      { name: 'price', type: AdminFieldType.INTEGER },
      { name: 'stock', type: AdminFieldType.INTEGER },
    ],
    collectionAttributes: ['name', 'price', 'stock'],
    collectionFilterAttributes: ['name', 'price', 'stock'],
    showAttributes: ['name', 'price', 'stock'],
    createFormAttributes: ['name', 'price', 'stock'],
    editFormAttributes: ['name', 'price', 'stock'],

    // Text searchable attributes. Only supports String attribute types
    searchAttributes: ['name'],
  });
}
