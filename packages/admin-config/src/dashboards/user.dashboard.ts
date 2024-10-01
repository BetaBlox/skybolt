import { User } from '@repo/database';
import { AdminFieldType } from '@repo/types';
import * as bcrypt from 'bcryptjs';
import { Dashboard, createDashboard } from '../dashboard';

export function createUserDashboard(): Dashboard<User> {
  return createDashboard<User>({
    pinnedOnHome: true,
    name: 'User',
    modelName: 'User',

    getDisplayName: (record: User): string =>
      `${record.firstName} ${record.lastName} (${record.email})`,

    attributeTypes: [
      { name: 'firstName', type: AdminFieldType.STRING },
      { name: 'lastName', type: AdminFieldType.STRING },
      { name: 'email', type: AdminFieldType.STRING },
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
    collectionAttributes: ['firstName', 'lastName', 'email', 'isAdmin'],
    collectionFilterAttributes: ['firstName', 'lastName', 'email'],
    showAttributes: ['firstName', 'lastName', 'email', 'isAdmin'],
    createFormAttributes: [
      'firstName',
      'lastName',
      'email',
      'password',
      'isAdmin',
    ],
    editFormAttributes: [
      'firstName',
      'lastName',
      'email',
      // 'password', // need to figure out how to hash this first
      'isAdmin',
    ],
    // Text searchable attributes. Only supports String attribute types
    searchAttributes: ['firstName', 'lastName', 'email'],

    isDeletable(record: User): boolean {
      return record.isAdmin === false;
    },

    // isEditable(record: User): boolean {
    //   return true;
    // }
    // isCreatable(): boolean {
    //   return true;
    // }

    // Hook when a user record is created.
    async beforeCreate(data: User): Promise<object> {
      // Hash the user's password so they can authenticate and login
      const salt = bcrypt.genSaltSync(10);
      data.password = bcrypt.hashSync(data.password, salt);

      return data;
    },
  });
}
