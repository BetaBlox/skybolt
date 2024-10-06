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
    { name: 'createdAt', type: AdminFieldType.DATETIME },
    { name: 'updatedAt', type: AdminFieldType.DATETIME },
  ],
  collectionAttributes: ['title', 'author', 'createdAt', 'updatedAt'],
  collectionFilterAttributes: ['title', 'content', 'author'],
  showAttributes: ['title', 'author', 'content', 'createdAt', 'updatedAt'],
  createFormAttributes: ['title', 'content', 'author'],
  editFormAttributes: ['title', 'content', 'author'],

  // Text searchable attributes. Only supports String attribute types
  searchAttributes: ['title'],
});
