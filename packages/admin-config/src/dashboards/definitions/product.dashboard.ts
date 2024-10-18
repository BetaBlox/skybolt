import { Product } from '@repo/database';
import { AdminFieldType } from '@repo/types';
import { createDashboard } from '../create-dashboard';

export const ProductDashboard = createDashboard<Product>({
  name: 'Product',
  modelName: 'Product',

  pinnedOnHome: true,

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
