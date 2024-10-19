import { Post } from '@repo/database';
import { AdminFieldType } from '@repo/types';
import { createDashboard } from '../create-dashboard';

export const PostDashboard = createDashboard<Post>({
  name: 'Post',
  modelName: 'Post',

  getDisplayName: (record: Post): string => record.title,

  attributeTypes: [
    { name: 'title', type: AdminFieldType.STRING },
    { name: 'content', type: AdminFieldType.TEXT },
    {
      name: 'author',
      type: AdminFieldType.RELATIONSHIP_HAS_ONE,
      sourceKey: 'authorId',
      modelName: 'user',
      relatedAttributes: [
        { name: 'firstName', type: AdminFieldType.STRING },
        { name: 'lastName', type: AdminFieldType.STRING },
        { name: 'email', type: AdminFieldType.STRING },
      ],
    },
    { name: 'authorId', type: AdminFieldType.INTEGER },
    { name: 'publishDate', type: AdminFieldType.DATE },
    { name: 'createdAt', type: AdminFieldType.DATETIME },
    { name: 'updatedAt', type: AdminFieldType.DATETIME },
  ],
  collectionAttributes: [
    'title',
    'author',
    'publishDate',
    'createdAt',
    'updatedAt',
  ],
  collectionFilterAttributes: ['title', 'content', 'author'],
  showAttributes: [
    'title',
    'author',
    'publishDate',
    'content',
    'createdAt',
    'updatedAt',
  ],
  createFormAttributes: ['title', 'author', 'content', 'publishDate'],
  editFormAttributes: ['title', 'author', 'content', 'publishDate'],

  // Text searchable attributes. Only supports String attribute types
  searchAttributes: ['title'],

  showPageWidgets: [
    {
      type: 'row',
      components: [{ componentName: 'RecordDetailsCard', span: 12 }],
    },
    {
      type: 'row',
      heading: 'Related Records',
      components: [{ componentName: 'HasOneRelationshipsCard', span: 12 }],
    },
  ],
});
