/**
 * Admin config is heavily inspired by Administrate from Ruby on Rails
 *
 * @see https://administrate-demo.herokuapp.com
 */
import { Color, Post, User } from '@repo/database';
import {
  AdminAttributeType,
  AdminConfig,
  AdminFieldType,
  AdminModel,
} from '@repo/types';
import { camelize } from '@repo/utils';

export const AdmingConfig: AdminConfig = {
  models: {
    user: {
      getDisplayName: (record: User) =>
        `${record.firstName} ${record.lastName} (${record.email})`,
      attributeTypes: [
        { name: 'firstName', type: AdminFieldType.STRING },
        { name: 'lastName', type: AdminFieldType.STRING },
        { name: 'email', type: AdminFieldType.STRING },
        { name: 'isAdmin', type: AdminFieldType.BOOLEAN },
        { name: 'password', type: AdminFieldType.PASSWORD },
        { name: 'createdAt', type: AdminFieldType.DATETIME },
        { name: 'updatedAt', type: AdminFieldType.DATETIME },
      ],
      collectionAttributes: ['firstName', 'lastName', 'email', 'isAdmin'],
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
    },
    post: {
      getDisplayName: (record: Post) => record.title,
      attributeTypes: [
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
      ],
      collectionAttributes: ['title', 'authorId', 'createdAt', 'updatedAt'],
      showAttributes: [
        'title',
        'authorId',
        'content',
        'createdAt',
        'updatedAt',
      ],
      createFormAttributes: ['title', 'content', 'author'],
      editFormAttributes: ['title', 'content', 'author'],
    },
    color: {
      getDisplayName: (record: Color) => record.label,
      attributeTypes: [
        { name: 'label', type: AdminFieldType.STRING },
        { name: 'hex', type: AdminFieldType.STRING },
        { name: 'createdAt', type: AdminFieldType.DATETIME },
        { name: 'updatedAt', type: AdminFieldType.DATETIME },
      ],
      collectionAttributes: ['label', 'hex', 'createdAt', 'updatedAt'],
      showAttributes: ['label', 'hex', 'createdAt', 'updatedAt'],
      createFormAttributes: ['label', 'hex'],
      editFormAttributes: ['label', 'hex'],
    },
  },
};

export function getModel(modelName: string): AdminModel {
  // camelize because we need to convert 'Dispensary' to 'dispensary'
  return AdmingConfig.models[camelize(modelName)];
}

export function getAttributeType(
  modelName: string,
  attribute: string,
): AdminAttributeType {
  const { attributeTypes } = getModel(modelName);

  return attributeTypes.find(
    (at) => at.name === attribute,
  ) as AdminAttributeType;
}

export function renderFieldInCollectionView(
  record: any,
  modelName: string,
  attribute: string,
): string {
  const attributeType = getAttributeType(modelName, attribute);
  const value = record[attributeType.name];

  switch (attributeType.type) {
    case AdminFieldType.JSON:
      return JSON.stringify(value, null, 2);
    case AdminFieldType.BOOLEAN:
      return value === true ? 'yes' : 'no';
    case AdminFieldType.RELATIONSHIP_HAS_ONE:
      const relationshipModelName = attributeType.modelName!;
      const relationshipRecord = record[relationshipModelName];

      if (!relationshipRecord) {
        throw new Error(
          "No relationship record found on your model. Did you forget to 'include' it with your query?",
        );
      }

      const { getDisplayName } = getModel(relationshipModelName);
      return getDisplayName(relationshipRecord) as string;
    default:
      return record[attributeType.name];
  }
}

export function renderFieldInShowView(
  record: any,
  modelName: string,
  attribute: string,
): string {
  const attributeType = getAttributeType(modelName, attribute);
  const value = record[attributeType.name];

  switch (attributeType.type) {
    case AdminFieldType.JSON:
      return JSON.stringify(value, null, 2);
    case AdminFieldType.BOOLEAN:
      return value === true ? 'yes' : 'no';
    case AdminFieldType.RELATIONSHIP_HAS_ONE:
      const relationshipModelName = attributeType.modelName!;
      const relationshipRecord = record[relationshipModelName];

      if (!relationshipRecord) {
        throw new Error(
          "No relationship record found on your model. Did you forget to 'include' it with your query?",
        );
      }

      const { getDisplayName } = getModel(relationshipModelName);
      return getDisplayName(relationshipRecord) as string;
    default:
      return record[attributeType.name];
  }
}
