import { Post } from '@repo/database';
import { FieldType } from '@repo/types/admin';
import { createDashboard } from '../create-dashboard';

export const PostDashboard = createDashboard<Post>({
  name: 'Post',
  modelName: 'Post',

  showOnDatasets: true,

  getDisplayName: (record: Post): string => record.title,

  attributeTypes: [
    { name: 'title', type: FieldType.STRING },
    { name: 'content', type: FieldType.TEXT },
    {
      name: 'author',
      type: FieldType.RELATIONSHIP_HAS_ONE,
      sourceKey: 'authorId',
      modelName: 'user',
      relatedAttributes: [
        { name: 'firstName', type: FieldType.STRING },
        { name: 'lastName', type: FieldType.STRING },
        { name: 'email', type: FieldType.STRING },
      ],
    },
    { name: 'authorId', type: FieldType.INTEGER },
    { name: 'publishDate', type: FieldType.DATE },
    { name: 'createdAt', type: FieldType.DATETIME },
    { name: 'updatedAt', type: FieldType.DATETIME },
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
