import { Injectable } from '@nestjs/common';
import { DMMF, Prisma } from 'database';
import * as admin from '@/config/admin';
import { PrismaService } from '@/prisma/prisma.service';

interface RecordPayload {
  prismaModelConfig: DMMF.Model;
  attributeTypes: admin.AdminAttributeType[];
  collectionAttributes: string[];
  showAttributes: string[];
  formAttributes: string[];
  record: any;
  displayName: string;
}

interface RecordsPayload {
  prismaModelConfig: DMMF.Model;
  attributeTypes: admin.AdminAttributeType[];
  collectionAttributes: string[];
  showAttributes: string[];
  formAttributes: string[];
  // TODO: probably shouldn't mutate the raw data. Maybe a separate displayName lookup hash?
  records: any[] & {
    displayName: string;
  };
}

@Injectable()
export class RecordsService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(modelName: string): Promise<RecordsPayload> {
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

    const records = await this.prisma[modelName].findMany();

    return {
      prismaModelConfig,
      attributeTypes: adminModelConfig.attributeTypes,
      collectionAttributes: adminModelConfig.collectionAttributes,
      showAttributes: adminModelConfig.showAttributes,
      formAttributes: adminModelConfig.formAttributes,
      records: records.map((record) => ({
        ...record,
        displayName: adminModelConfig.getDisplayName(record) as string,
      })),
    };
  }

  async getRecord(modelName: string, id: number): Promise<RecordPayload> {
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

    const record = await this.prisma[modelName].findFirst({
      where: {
        id,
      },
    });

    return {
      prismaModelConfig,
      attributeTypes: adminModelConfig.attributeTypes,
      collectionAttributes: adminModelConfig.collectionAttributes,
      showAttributes: adminModelConfig.showAttributes,
      formAttributes: adminModelConfig.formAttributes,
      record,
      displayName: adminModelConfig.getDisplayName(record) as string,
    };
  }

  async createRecord(modelName: string, data: object): Promise<RecordPayload> {
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

    // TODO: filter data by adminModelConfig.formAttributes so we limit scope of modified data

    const record = await this.prisma[modelName].create({
      data,
    });

    return {
      prismaModelConfig,
      attributeTypes: adminModelConfig.attributeTypes,
      collectionAttributes: adminModelConfig.collectionAttributes,
      showAttributes: adminModelConfig.showAttributes,
      formAttributes: adminModelConfig.formAttributes,
      record,
      displayName: adminModelConfig.getDisplayName(record) as string,
    };
  }

  async updateRecord(
    modelName: string,
    id: number,
    data: object,
  ): Promise<RecordPayload> {
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

    // TODO: filter data by adminModelConfig.formAttributes so we limit scope of modified data

    const record = await this.prisma[modelName].update({
      where: {
        id,
      },
      data,
    });

    return {
      prismaModelConfig,
      attributeTypes: adminModelConfig.attributeTypes,
      collectionAttributes: adminModelConfig.collectionAttributes,
      showAttributes: adminModelConfig.showAttributes,
      formAttributes: adminModelConfig.formAttributes,
      record,
      displayName: adminModelConfig.getDisplayName(record) as string,
    };
  }
}
