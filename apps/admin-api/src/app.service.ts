import { Injectable } from '@nestjs/common';
import { DMMF, Prisma } from 'database';
import * as admin from '@/config/admin';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Hello from the Admin Api!';
  }

  getModels(): DMMF.Model[] {
    return Prisma.dmmf.datamodel.models;
  }

  async getModel(modelName: string): Promise<{
    prismaModelConfig: DMMF.Model;
    attributeTypes: admin.AdminAttributeType[];
    collectionAttributes: string[];
    showAttributes: string[];
    formAttributes: string[];
    count: number;
    records: any[];
  }> {
    const prismaModelConfig = Prisma.dmmf.datamodel.models.find(
      (model) => model.name.toLowerCase() === modelName.toLowerCase(),
    );

    const adminModelConfig = admin.getModel(modelName);

    const count = await this.prisma[modelName].count();
    const records = await this.prisma[modelName].findMany();

    return {
      prismaModelConfig,
      attributeTypes: adminModelConfig.attributeTypes,
      collectionAttributes: adminModelConfig.collectionAttributes,
      showAttributes: adminModelConfig.showAttributes,
      formAttributes: adminModelConfig.formAttributes,
      count,
      records,
    };
  }
}
