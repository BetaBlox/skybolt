import { Post } from '@repo/database';
import { AdminFieldType } from '@repo/types';
import Dashboard from './Dashboard';

export class PostDashboard extends Dashboard {
  name = 'Post';
  modelName = 'Post';

  getDisplayName = (record: Post): string => record.title;
  attributeTypes = [
    { name: 'title', type: AdminFieldType.STRING },
    { name: 'content', type: AdminFieldType.TEXT },
    {
      name: 'author',
      type: AdminFieldType.RELATIONSHIP_HAS_ONE,
      sourceKey: 'authorId',
      modelName: 'user',
    },
    { name: 'authorId', type: AdminFieldType.INTEGER },
    { name: 'createdAt', type: AdminFieldType.DATETIME },
    { name: 'updatedAt', type: AdminFieldType.DATETIME },
  ];
  collectionAttributes = ['title', 'author', 'createdAt', 'updatedAt'];
  showAttributes = ['title', 'author', 'content', 'createdAt', 'updatedAt'];
  createFormAttributes = ['title', 'content', 'author'];
  editFormAttributes = ['title', 'content', 'author'];

  // isDeletable(record: Post): boolean {
  //   return true;
  // }
  // isEditable(record: Post): boolean {
  //   return true;
  // }
  // isCreatable(): boolean {
  //   return true;
  // }
}
