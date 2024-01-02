/**
 * Admin config is heavily inspired by Administrate from Ruby on Rails
 *
 * @see https://administrate-demo.herokuapp.com
 */
import {
    User,
    DMMF,
    getPrismaModel,
  } from "database";
  import { camelize } from "utils";
  
  export enum Field {
    STRING = "string",
    TEXT = "text",
    BOOLEAN = "boolean",
    INTEGER = "int",
    SELECT = "select",
    JSON = "json",
    RELATIONSHIP_HAS_ONE = "relationship_has_one",
  }
  
  export type SelectOption = { label: string; value: string };
  
  export type AdminAttributeType = {
    name: string;
    type: Field;
    options?: SelectOption[];
    modelName?: string;
    sourceKey?: string;
    defaultValue?: any;
  };
  export type AdminModel = {
    getDisplayName: (record: any) => string | number;
    attributeTypes: AdminAttributeType[];
    collectionAttributes: string[];
    showAttributes: string[];
    formAttributes: string[];
  };
  
  type AdminConfig = {
    models: { [key: string]: AdminModel };
  };
  export const AdmingConfig: AdminConfig = {
    models: {
      user: {
        getDisplayName: (record: User) =>
          `${record.firstName} ${record.lastName} (${record.email})`,
        attributeTypes: [
          { name: "firstName", type: Field.STRING },
          { name: "lastName", type: Field.STRING },
          { name: "email", type: Field.STRING },
          { name: "isAdmin", type: Field.BOOLEAN },
          { name: "acceptsPromotionalNotifications", type: Field.BOOLEAN },
        ],
        collectionAttributes: [
          "firstName",
          "lastName",
          "email",
          "isAdmin",
        ],
        showAttributes: [
          "firstName",
          "lastName",
          "email",
          "isAdmin",
        ],
        formAttributes: [
          "firstName",
          "lastName",
          "email",
          "isAdmin",
        ],
      },
    },
  };
  
  export function getModel(modelName: string): AdminModel {
    // camelize because we need to convert 'Dispensary' to 'dispensary'
    return AdmingConfig.models[camelize(modelName)];
  }
  
  /**
   * @see https://stackoverflow.com/questions/7225407/convert-camelcasetext-to-title-case-text
   */
  export function modelDisplayName(modelName: string): string {
    const text = modelName.replace(/([A-Z])/g, " $1");
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  
  export function getRecordDisplayName(modelName: string, record: any): string {
    const model = getModel(modelName);
    return model.getDisplayName(record) as string;
  }
  
  export function collectionUrl(modelName: string) {
    return `/admin/models/${modelName}`;
  }
  
  export function showUrl(modelName: string, record: any) {
    return `/admin/models/${modelName}/${record.id}`;
  }
  
  export function createUrl(modelName: string) {
    return `/admin/models/${modelName}/new`;
  }
  
  export function editUrl(modelName: string, record: any) {
    return `/admin/models/${modelName}/${record.id}/edit`;
  }
  
  export function deleteUrl(modelName: string, record: any) {
    return `/admin/models/${modelName}/${record.id}/delete`;
  }
  
  export function deleteRecord(modelName: string, record: any) {
    fetch("/admin/api/delete", {
        method: "POST",
        body: JSON.stringify({
            modelName,
            id: record.id,
          })
        });
  }
  
  export function getPrismaField(
    modelName: string,
    fieldName: string,
  ): DMMF.Field {
    const prismaModel = getPrismaModel(modelName);
  
    const field = prismaModel?.fields.find(
      (f) => f.name.toLowerCase() === fieldName.toLowerCase(),
    );
  
    if (!field) {
      throw new Error("FIELD_NOT_FOUND");
    }
  
    return field;
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
      case Field.BOOLEAN:
        return value === true ? "yes" : "no";
      case Field.RELATIONSHIP_HAS_ONE:
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
      case Field.JSON:
        return JSON.stringify(value, null, 2);
      case Field.BOOLEAN:
        return value === true ? "yes" : "no";
      case Field.RELATIONSHIP_HAS_ONE:
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
  
  export function getModelDefaultValues(modelName: string): object {
    const modelConfig = getModel(modelName);
    const { formAttributes } = modelConfig;
  
    const defaultValues = {};
    formAttributes.forEach((attribute) => {
      const attributeType = getAttributeType(modelName, attribute);
      if (attributeType.defaultValue) {
        defaultValues[attributeType.name] = attributeType.defaultValue;
      }
    });
  
    return defaultValues;
  }