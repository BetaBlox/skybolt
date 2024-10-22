import { User } from '@repo/database';
import { AdminFieldType } from '@repo/types';
import { createDashboard } from '../create-dashboard';

export const UserDashboard = createDashboard<User>({
  name: 'User',
  modelName: 'User',

  pinnedOnHome: true,

  getDisplayName: (record: User): string =>
    `${record.firstName} ${record.lastName} (${record.email})`,

  attributeTypes: [
    { name: 'firstName', type: AdminFieldType.STRING },
    { name: 'lastName', type: AdminFieldType.STRING },
    { name: 'email', type: AdminFieldType.EMAIL },
    { name: 'bio', type: AdminFieldType.TEXT, maxLength: 500, rows: 8 },
    {
      name: 'image',
      type: AdminFieldType.IMAGE,
      sourceKey: 'imageId',
      modelName: 'asset',
    },
    { name: 'imageId', type: AdminFieldType.INTEGER },
    { name: 'isAdmin', type: AdminFieldType.BOOLEAN },
    { name: 'password', type: AdminFieldType.PASSWORD },
    {
      name: 'Posts',
      type: AdminFieldType.RELATIONSHIP_HAS_MANY,
      modelName: 'Post',
      relationField: 'authorId',
      relatedAttributes: [
        { name: 'firstName', type: AdminFieldType.STRING },
        { name: 'lastName', type: AdminFieldType.STRING },
        { name: 'email', type: AdminFieldType.STRING },
      ],
    },
    { name: 'createdAt', type: AdminFieldType.DATETIME },
    { name: 'updatedAt', type: AdminFieldType.DATETIME },
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
