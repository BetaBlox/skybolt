import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/database';
import * as admin from '@/config/admin';
import { PrismaService } from '@/prisma/prisma.service';
import {
  AdminAttributeType,
  AdminFieldType,
  AdminRecordPayload,
  AdminRecordsPayload,
} from '@repo/types';
import * as argon2 from 'argon2';

@Injectable()
export class RecordsService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(modelName: string): Promise<AdminRecordsPayload> {
    const prismaModelConfig = Prisma.dmmf.datamodel.models.find(
      (model) => model.name.toLowerCase() === modelName.toLowerCase(),
    );

    if (!prismaModelConfig) {
      throw new Error(`Unable to find Prisma config for model: ${modelName}`);
    }

    const adminModelConfig = admin.getModel(modelName);

    if (!adminModelConfig) {
      throw new Error(`Unable to find Admin config for model: ${modelName}`);
    }

    // Dynamically include related models
    const include = {};
    adminModelConfig.attributeTypes.forEach((at) => {
      if (at.type === AdminFieldType.RELATIONSHIP_HAS_ONE) {
        include[at.name] = true;
      }
    });

    const records = await this.prisma[modelName].findMany({
      include,
    });

    return {
      prismaModelConfig,
      attributeTypes: adminModelConfig.attributeTypes,
      collectionAttributes: adminModelConfig.collectionAttributes,
      showAttributes: adminModelConfig.showAttributes,
      createFormAttributes: adminModelConfig.createFormAttributes,
      editFormAttributes: adminModelConfig.editFormAttributes,
      records: records.map((record) => ({
        ...record,
        displayName: adminModelConfig.getDisplayName(record) as string,
      })),
    };
  }

  async getRecord(modelName: string, id: number): Promise<AdminRecordPayload> {
    const prismaModelConfig = Prisma.dmmf.datamodel.models.find(
      (model) => model.name.toLowerCase() === modelName.toLowerCase(),
    );

    if (!prismaModelConfig) {
      throw new Error(`Unable to find Prisma config for model: ${modelName}`);
    }

    const adminModelConfig = admin.getModel(modelName);

    if (!adminModelConfig) {
      throw new Error(`Unable to find Admin config for model: ${modelName}`);
    }

    // Dynamically include related models
    const include = {};
    adminModelConfig.attributeTypes.forEach((at) => {
      if (at.type === AdminFieldType.RELATIONSHIP_HAS_ONE) {
        include[at.name] = true;
      }
    });

    const record = await this.prisma[modelName].findFirst({
      where: {
        id,
      },
      include,
    });

    return {
      prismaModelConfig,
      attributeTypes: adminModelConfig.attributeTypes,
      collectionAttributes: adminModelConfig.collectionAttributes,
      showAttributes: adminModelConfig.showAttributes,
      createFormAttributes: adminModelConfig.createFormAttributes,
      editFormAttributes: adminModelConfig.editFormAttributes,
      record,
      displayName: adminModelConfig.getDisplayName(record) as string,
    };
  }

  async createRecord(
    modelName: string,
    data: object,
  ): Promise<AdminRecordPayload> {
    const prismaModelConfig = Prisma.dmmf.datamodel.models.find(
      (model) => model.name.toLowerCase() === modelName.toLowerCase(),
    );

    if (!prismaModelConfig) {
      throw new Error(`Unable to find Prisma config for model: ${modelName}`);
    }

    const adminModelConfig = admin.getModel(modelName);

    if (!adminModelConfig) {
      throw new Error(`Unable to find Admin config for model: ${modelName}`);
    }

    let payload = filterRecordPayload(
      adminModelConfig.createFormAttributes,
      data,
    );

    // TODO: need a better way to do this because it's just isolated to the password field attribute type
    payload = await hashPasswordFields(
      adminModelConfig.attributeTypes,
      adminModelConfig.createFormAttributes,
      payload,
    );

    const record = await this.prisma[modelName].create({
      data: { ...payload },
    });

    return {
      prismaModelConfig,
      attributeTypes: adminModelConfig.attributeTypes,
      collectionAttributes: adminModelConfig.collectionAttributes,
      showAttributes: adminModelConfig.showAttributes,
      createFormAttributes: adminModelConfig.createFormAttributes,
      editFormAttributes: adminModelConfig.editFormAttributes,
      record,
      displayName: adminModelConfig.getDisplayName(record) as string,
    };
  }

  async updateRecord(
    modelName: string,
    id: number,
    data: object,
  ): Promise<AdminRecordPayload> {
    const prismaModelConfig = Prisma.dmmf.datamodel.models.find(
      (model) => model.name.toLowerCase() === modelName.toLowerCase(),
    );

    if (!prismaModelConfig) {
      throw new Error(`Unable to find Prisma config for model: ${modelName}`);
    }

    const adminModelConfig = admin.getModel(modelName);

    if (!adminModelConfig) {
      throw new Error(`Unable to find Admin config for model: ${modelName}`);
    }

    const payload = filterRecordPayload(
      adminModelConfig.editFormAttributes,
      data,
    );

    const record = await this.prisma[modelName].update({
      where: {
        id,
      },
      data: { ...payload },
    });

    return {
      prismaModelConfig,
      attributeTypes: adminModelConfig.attributeTypes,
      collectionAttributes: adminModelConfig.collectionAttributes,
      showAttributes: adminModelConfig.showAttributes,
      createFormAttributes: adminModelConfig.createFormAttributes,
      editFormAttributes: adminModelConfig.editFormAttributes,
      record,
      displayName: adminModelConfig.getDisplayName(record) as string,
    };
  }

  async deleteRecord(modelName: string, id: number): Promise<boolean> {
    const prismaModelConfig = Prisma.dmmf.datamodel.models.find(
      (model) => model.name.toLowerCase() === modelName.toLowerCase(),
    );

    if (!prismaModelConfig) {
      throw new Error(`Unable to find Prisma config for model: ${modelName}`);
    }

    const adminModelConfig = admin.getModel(modelName);

    if (!adminModelConfig) {
      throw new Error(`Unable to find Admin config for model: ${modelName}`);
    }

    await this.prisma[modelName].delete({
      where: {
        id,
      },
    });

    return true;
  }
}

/**
 * Filters a record payload and strips out data that is not supported by your model's attributes types.
 * This helps prevent unwanted data from being created/updated on the backend
 */
function filterRecordPayload(attributes: string[], data: object): object {
  const filtered = {};

  attributes.forEach((key) => {
    filtered[key] = data[key];
  });

  return filtered;
}

async function hashPasswordFields(
  attributeTypes: AdminAttributeType[],
  attributes: string[],
  data: object,
): Promise<object> {
  const result = { ...data };

  const passwordAttributes = attributes.filter((attributeKey) => {
    const attributeType = attributeTypes.find((at) => at.name === attributeKey);

    return attributeType && attributeType.type === AdminFieldType.PASSWORD;
  });

  const promises = passwordAttributes.map(async (attributeKey) => {
    result[attributeKey] = await argon2.hash(result[attributeKey]);
  });

  await Promise.all(promises);

  return result;
}
