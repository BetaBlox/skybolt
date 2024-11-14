import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import {
  AdminFieldType,
  AdminModelPayload,
  SortDirection,
} from '@repo/types/sort';
import { Dashboard, getDashboard, getDashboards } from '@repo/admin-config';
import { PrismaAdapter } from '@repo/database';

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
    const dashboard = getDashboard(modelName);
    const include = buildIncludeClause(dashboard);

    const count = await this.prisma[modelName].count();
    const recentRecords = await this.prisma[modelName].findMany({
      take: 3,
      include,
      orderBy: [
        {
          id: SortDirection.DESC,
        },
      ],
    });

    const adapter = new PrismaAdapter();

    return {
      modelName: dashboard.modelName,
      fields: adapter.getFields(modelName),
      count,
      recentRecords: recentRecords.map((record) => ({
        ...record,
        displayName: dashboard.getDisplayName(record) as string,
      })),
    };
  }
}

function buildIncludeClause(dashboard: Dashboard<unknown>) {
  const include = {};
  dashboard.attributeTypes.forEach((at) => {
    if (at.type === AdminFieldType.RELATIONSHIP_HAS_ONE) {
      include[at.name] = true;
    }
  });

  return include;
}
