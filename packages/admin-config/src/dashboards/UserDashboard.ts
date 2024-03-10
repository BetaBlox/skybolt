import { User } from '@repo/database';
import { AdminFieldType } from '@repo/types';
import Dashboard from './Dashboard';

export class UserDashboard extends Dashboard {
  name = 'User';
  modelName = 'User';

  getDisplayName = (record: User): string =>
    `${record.firstName} ${record.lastName} (${record.email})`;

  attributeTypes = [
    { name: 'firstName', type: AdminFieldType.STRING },
    { name: 'lastName', type: AdminFieldType.STRING },
    { name: 'email', type: AdminFieldType.STRING },
    { name: 'isAdmin', type: AdminFieldType.BOOLEAN },
    { name: 'password', type: AdminFieldType.PASSWORD },
    { name: 'createdAt', type: AdminFieldType.DATETIME },
    { name: 'updatedAt', type: AdminFieldType.DATETIME },
  ];
  collectionAttributes = ['firstName', 'lastName', 'email', 'isAdmin'];
  showAttributes = ['firstName', 'lastName', 'email', 'isAdmin'];
  createFormAttributes = [
    'firstName',
    'lastName',
    'email',
    'password',
    'isAdmin',
  ];
  editFormAttributes = [
    'firstName',
    'lastName',
    'email',
    // 'password', // need to figure out how to hash this first
    'isAdmin',
  ];

  isDeletable = (record: User) => record.isAdmin === false;
  // isEditable = (record: User) => true;
  // isCreatable = () => true;
}
