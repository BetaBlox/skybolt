import { User } from '@repo/database';
import { FieldType } from '@repo/types/admin';
import { createDashboard } from '../create-dashboard';

export const UserDashboard = createDashboard<User>({
  name: 'User',
  modelName: 'User',

  pinnedOnHome: true,
  showOnDatasets: true,

  getDisplayName: (record: User): string =>
    `${record.firstName} ${record.lastName} (${record.email})`,

  attributeTypes: [
    { name: 'firstName', type: FieldType.STRING },
    { name: 'lastName', type: FieldType.STRING },
    { name: 'email', type: FieldType.EMAIL },
    { name: 'bio', type: FieldType.TEXT, maxLength: 500, rows: 8 },
    {
      name: 'image',
      type: FieldType.IMAGE,
      sourceKey: 'imageId',
      modelName: 'asset',
    },
    { name: 'imageId', type: FieldType.INTEGER },
    { name: 'isAdmin', type: FieldType.BOOLEAN },
    { name: 'password', type: FieldType.PASSWORD },
    {
      name: 'Posts',
      type: FieldType.RELATIONSHIP_HAS_MANY,
      modelName: 'Post',
      relationField: 'authorId',
      relatedAttributes: [
        { name: 'firstName', type: FieldType.STRING },
        { name: 'lastName', type: FieldType.STRING },
        { name: 'email', type: FieldType.STRING },
      ],
    },
    { name: 'createdAt', type: FieldType.DATETIME },
    { name: 'updatedAt', type: FieldType.DATETIME },
  ],
  collectionAttributes: [
    // 'imageUrl',
    'firstName',
    'lastName',
    'email',
    'isAdmin',
  ],
  collectionFilterAttributes: ['firstName', 'lastName', 'email'],
  showAttributes: ['image', 'firstName', 'lastName', 'email', 'bio', 'isAdmin'],
  createFormAttributes: [
    'firstName',
    'lastName',
    'email',
    'image',
    'bio',
    'password',
    'isAdmin',
  ],
  editFormAttributes: [
    'firstName',
    'lastName',
    'email',
    'image',
    'bio',
    // 'password', // need to figure out how to hash this first
    'isAdmin',
  ],
  // Text searchable attributes. Only supports String attribute types
  searchAttributes: ['firstName', 'lastName', 'email'],

  showPageWidgets: [
    {
      type: 'row',
      components: [{ componentName: 'RecordDetailsCard', span: 12 }],
    },
    {
      type: 'row',
      heading: 'Related Collections',
      components: [{ componentName: 'RelatedCollectionTabs', span: 12 }],
    },
    {
      type: 'row',
      components: [{ componentName: 'ImpersonateUserCard', span: 12 }],
    },
    {
      type: 'row',
      components: [{ componentName: 'UpdatePasswordCard', span: 12 }],
    },
  ],

  isDeletable(record: User): boolean {
    return record.isAdmin === false;
  },
});
