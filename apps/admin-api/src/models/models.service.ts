import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/database';
import * as admin from '@/config/admin';
import { PrismaService } from '@/prisma/prisma.service';
import { AdminFieldType, AdminModelPayload } from '@repo/types';

@Injectable()
export class ModelsService {
  constructor(private readonly prisma: PrismaService) {}

  async getModels(): Promise<AdminModelPayload[]> {
    const adminModelNames = Object.keys(admin.AdmingConfig.models);
    const promises = adminModelNames.map((modelName) => {
      return this.getModel(modelName);
    });
    return Promise.all(promises);
  }

  async getModel(modelName: string): Promise<AdminModelPayload> {
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

    const count = await this.prisma[modelName].count();
    const records = await this.prisma[modelName].findMany({ include });
    const recentRecords = await this.prisma[modelName].findMany({
      take: 3,
      include,
    });

    return {
      prismaModelConfig,
      attributeTypes: adminModelConfig.attributeTypes,
      collectionAttributes: adminModelConfig.collectionAttributes,
      showAttributes: adminModelConfig.showAttributes,
      formAttributes: adminModelConfig.formAttributes,
      count,
      recentRecords: recentRecords.map((record) => ({
        ...record,
        displayName: adminModelConfig.getDisplayName(record) as string,
      })),
      records: records.map((record) => ({
        ...record,
        displayName: adminModelConfig.getDisplayName(record) as string,
      })),
    };
  }
}
