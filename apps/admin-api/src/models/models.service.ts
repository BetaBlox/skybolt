import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { AdminFieldType, AdminModelPayload } from '@repo/types';
import { getDashboard, getDashboards } from '@repo/admin-config';
import { getPrismaModel } from '@repo/database';

@Injectable()
export class ModelsService {
  constructor(private readonly prisma: PrismaService) {}

  async getModels(): Promise<AdminModelPayload[]> {
    const modelNames = getDashboards().map((d) => d.modelName);
    const promises = modelNames.map((modelName) => {
      return this.getModel(modelName);
    });
    return Promise.all(promises);
  }

  async getModel(modelName: string): Promise<AdminModelPayload> {
    const prismaModel = getPrismaModel(modelName);
    const dashboard = getDashboard(modelName);

    // Dynamically include related models
    const include = {};
    dashboard.attributeTypes.forEach((at) => {
      if (at.type === AdminFieldType.RELATIONSHIP_HAS_ONE) {
        include[at.name] = true;
      }
    });

    const count = await this.prisma[modelName].count();
    const recentRecords = await this.prisma[modelName].findMany({
      take: 3,
      include,
      orderBy: [
        {
          id: 'desc',
        },
      ],
    });

    return {
      prismaModel,
      modelName: dashboard.modelName,
      count,
      recentRecords: recentRecords.map((record) => ({
        ...record,
        displayName: dashboard.getDisplayName(record) as string,
      })),
    };
  }
}
