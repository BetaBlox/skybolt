import { Injectable } from '@nestjs/common';
import { DMMF, getPrismaModel } from '@repo/database';
import { PrismaService } from '@/prisma/prisma.service';
import {
  AdminFieldType,
  AdminRecordPayload,
  AdminRecordsPayload,
  PaginateFunction,
  PaginatedResult,
} from '@repo/types';
import { getDashboard } from '@repo/admin-config';
import { paginator } from '@repo/paginator';

const paginate: PaginateFunction = paginator();

@Injectable()
export class RecordsService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    modelName: string,
    search: string,
    page: number,
    perPage: number,
  ): Promise<AdminRecordsPayload> {
    const prismaModel = getPrismaModel(modelName);
    const dashboard = getDashboard(modelName);

    // Build a filter clause including all searchable attributes
    const where =
      dashboard.searchAttributes.length > 0
        ? {
            OR: dashboard.searchAttributes.map((attribute) => ({
              [attribute]: { contains: search, mode: 'insensitive' },
            })),
          }
        : {};

    // Dynamically include related models
    const include = {};
    dashboard.attributeTypes.forEach((at) => {
      if (at.type === AdminFieldType.RELATIONSHIP_HAS_ONE) {
        include[at.name] = true;
      }
    });

    const paginatedResult: PaginatedResult<any> = await paginate(
      this.prisma[modelName],
      {
        include,
        where,
      },
      {
        page,
        perPage,
      },
    );

    return {
      prismaModel,
      modelName,
      paginatedResult,
    };
  }

  async getRecord(modelName: string, id: number): Promise<AdminRecordPayload> {
    const prismaModel = getPrismaModel(modelName);
    const dashboard = getDashboard(modelName);

    // Dynamically include related models
    const include = {};
    dashboard.attributeTypes.forEach((at) => {
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
      prismaModel,
      modelName,
      record,
    };
  }

  async createRecord(
    modelName: string,
    data: object,
  ): Promise<AdminRecordPayload> {
    const prismaModel = getPrismaModel(modelName);
    const dashboard = getDashboard(modelName);

    if (dashboard.isCreatable() === false) {
      throw new Error('Record is not creatable');
    }

    let payload = filterRecordPayload(prismaModel, data);

    payload = await dashboard.beforeCreate(payload);

    const record = await this.prisma[modelName].create({
      data: { ...payload },
    });

    return {
      prismaModel,
      modelName,
      record,
    };
  }

  async updateRecord(
    modelName: string,
    id: number,
    data: object,
  ): Promise<AdminRecordPayload> {
    const prismaModel = getPrismaModel(modelName);
    const dashboard = getDashboard(modelName);

    let record = await this.prisma[modelName].findFirstOrThrow({
      where: {
        id,
      },
    });

    if (dashboard.isEditable(record) === false) {
      throw new Error('Record is not editable');
    }

    const payload = filterRecordPayload(prismaModel, data);

    record = await this.prisma[modelName].update({
      where: {
        id,
      },
      data: { ...payload },
    });

    return {
      prismaModel,
      modelName,
      record,
    };
  }

  async deleteRecord(modelName: string, id: number): Promise<boolean> {
    const record = await this.prisma[modelName].findFirstOrThrow({
      where: {
        id,
      },
    });

    const dashboard = getDashboard(modelName);

    if (dashboard.isDeletable(record) === false) {
      throw new Error('Record is not deletable');
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
function filterRecordPayload(prismaModel: DMMF.Model, data: object): object {
  const filtered = {};

  Object.keys(data).forEach((key) => {
    const isValid = prismaModel.fields.some((field) => {
      return field.name === key && field.relationName === undefined;
    });

    /**
     * Also validate that the attribute actually exists in the database
     *
     * This prvents issues with relationship fields such as a post's author author
     * being submitted to the database instead of the foreign key authorId;
     *
     * {
     *     name: 'author',
     *     // ...
     *     type: 'User',
     *     relationName: 'PostToUser',
     *     relationFromFields: [ 'authorId' ],
     *     relationToFields: [ 'id' ],
     * },
     */
    if (isValid) {
      filtered[key] = data[key];
    }
  });

  return filtered;
}
