import { Product } from '@repo/database';
import { FieldType } from '@repo/types/admin';
import { createDashboard } from '../create-dashboard';

export const ProductDashboard = createDashboard<Product>({
  name: 'Product',
  modelName: 'Product',

  pinnedOnHome: true,
  showOnDatasets: true,

  getDisplayName: (record: Product): string => record.name,

  attributeTypes: [
    { name: 'name', type: FieldType.STRING },
    { name: 'price', type: FieldType.INTEGER },
    { name: 'stock', type: FieldType.INTEGER },
  ],
  collectionAttributes: ['name', 'price', 'stock'],
  collectionFilterAttributes: ['name', 'price', 'stock'],
  showAttributes: ['name', 'price', 'stock'],
  createFormAttributes: ['name', 'price', 'stock'],
  editFormAttributes: ['name', 'price', 'stock'],

  // Text searchable attributes. Only supports String attribute types
  searchAttributes: ['name'],
});
