import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import {
  AdminFieldType,
  AdminFilterOperator,
  AdminFilterType,
  AdminModelField,
  AdminRecordPayload,
  AdminRecordsPayload,
  PaginateFunction,
  PaginatedResult,
} from '@repo/types';
import { getDashboard } from '@repo/admin-config';
import { paginator } from '@repo/paginator';
import { PrismaAdapter } from '@repo/database';
import { Filter } from '@/records/types';

const paginate: PaginateFunction = paginator();

@Injectable()
export class RecordsService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    modelName: string,
    search: string,
    page: number,
    perPage: number,
    filters: Filter[] = [],
  ): Promise<AdminRecordsPayload> {
    const dashboard = getDashboard(modelName);
    const where = buildWhereClause(filters);

    // // Build a filter clause including all searchable attributes
    // if (search && dashboard.searchAttributes.length > 0) {
    //   where = {
    //     OR: dashboard.searchAttributes.map((attribute) => ({
    //       [attribute]: { contains: search, mode: 'insensitive' },
    //     })),
    //   };
    // }

    // // Apply filters
    // (filters as Filter[]).forEach((filter) => {
    //   const { field, operator, value, type } = filter;

    //   if (type === AdminFilterType.BOOLEAN) {
    //     where[field] = value === 'true';
    //   } else {
    //     switch (operator) {
    //       case AdminFilterOperator.EQUALS:
    //         where[field] = value;
    //         break;
    //       case AdminFilterOperator.CONTAINS:
    //         where[field] = { contains: value, mode: 'insensitive' };
    //         break;
    //       case AdminFilterOperator.GREATER_THAN:
    //         where[field] = { gt: value };
    //         break;
    //       case AdminFilterOperator.LESS_THAN:
    //         where[field] = { lt: value };
    //         break;
    //       case AdminFilterOperator.STARTS_WITH:
    //         where[field] = { startsWith: value };
    //         break;
    //       case AdminFilterOperator.ENDS_WITH:
    //         where[field] = { endsWith: value };
    //         break;
    //     }
    //   }
    // });

    // Dynamically include related models
    const include = {};
    dashboard.attributeTypes.forEach((at) => {
      if (at.type === AdminFieldType.RELATIONSHIP_HAS_ONE) {
        include[at.name] = true;
      }
    });

    const paginatedResult: PaginatedResult<unknown> = await paginate(
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

    const adapter = new PrismaAdapter();

    return {
      modelName,
      fields: adapter.getFields(modelName),
      paginatedResult,
    };
  }

  async getRecord(modelName: string, id: number): Promise<AdminRecordPayload> {
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

    const adapter = new PrismaAdapter();

    return {
      modelName,
      fields: adapter.getFields(modelName),
      record,
    };
  }

  async createRecord(
    modelName: string,
    data: object,
  ): Promise<AdminRecordPayload> {
    const adapter = new PrismaAdapter();
    const fields = adapter.getFields(modelName);
    const dashboard = getDashboard(modelName);

    if (dashboard.isCreatable() === false) {
      throw new Error('Record is not creatable');
    }

    let payload = filterRecordPayload(fields, data);

    payload = await dashboard.beforeCreate(payload);

    const record = await this.prisma[modelName].create({
      data: { ...payload },
    });

    return {
      modelName,
      fields,
      record,
    };
  }

  async updateRecord(
    modelName: string,
    id: number,
    data: object,
  ): Promise<AdminRecordPayload> {
    const adapter = new PrismaAdapter();
    const fields = adapter.getFields(modelName);
    const dashboard = getDashboard(modelName);

    let record = await this.prisma[modelName].findFirstOrThrow({
      where: {
        id,
      },
    });

    if (dashboard.isEditable(record) === false) {
      throw new Error('Record is not editable');
    }

    const payload = filterRecordPayload(fields, data);

    record = await this.prisma[modelName].update({
      where: {
        id,
      },
      data: { ...payload },
    });

    return {
      modelName,
      fields,
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

  async getRecordRegistrationsByMonth(modelName: string): Promise<number[]> {
    const currentYear = new Date().getFullYear();

    // Fetch records created in the current year
    const records = await this.prisma[modelName].findMany({
      where: {
        createdAt: {
          gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
          lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
        },
      },
      select: {
        createdAt: true,
      },
    });

    // Initialize an array with 12 slots to represent each month
    const registrationsByMonth = Array(12).fill(0);

    // Populate the registrationsByMonth array based on the records
    records.forEach((record) => {
      const month = new Date(record.createdAt).getMonth(); // 0 = January, 11 = December
      registrationsByMonth[month] += 1;
    });

    return registrationsByMonth;
  }

  async getKpis(modelName: string) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentWeekStart = new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay()),
    );

    // Fetch total records
    const totalRecords = await this.prisma[modelName].count();

    // Fetch records created this year
    const recordsThisYear = await this.prisma[modelName].count({
      where: {
        createdAt: {
          gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
          lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
        },
      },
    });

    // Fetch records created last year
    const recordsLastYear = await this.prisma[modelName].count({
      where: {
        createdAt: {
          gte: new Date(`${currentYear - 1}-01-01T00:00:00.000Z`),
          lt: new Date(`${currentYear}-01-01T00:00:00.000Z`),
        },
      },
    });

    // Fetch records created this month
    const recordsThisMonth = await this.prisma[modelName].count({
      where: {
        createdAt: {
          gte: new Date(
            `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01T00:00:00.000Z`,
          ),
          lt: new Date(
            `${currentYear}-${String(currentMonth + 2).padStart(2, '0')}-01T00:00:00.000Z`,
          ),
        },
      },
    });

    // Fetch records created last month
    const recordsLastMonth = await this.prisma[modelName].count({
      where: {
        createdAt: {
          gte: new Date(
            `${currentYear}-${String(currentMonth).padStart(2, '0')}-01T00:00:00.000Z`,
          ),
          lt: new Date(
            `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01T00:00:00.000Z`,
          ),
        },
      },
    });

    // Fetch records created this week
    const recordsThisWeek = await this.prisma[modelName].count({
      where: {
        createdAt: {
          gte: currentWeekStart,
          lt: new Date(), // Current date
        },
      },
    });

    // Fetch records created last week
    const lastWeekStart = new Date(currentWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    const recordsLastWeek = await this.prisma[modelName].count({
      where: {
        createdAt: {
          gte: lastWeekStart,
          lt: currentWeekStart,
        },
      },
    });

    // Fetch the most recent record creation date
    const lastRecord = await this.prisma[modelName].findFirst({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        createdAt: true,
      },
    });

    // Calculate changes
    const yearChange =
      recordsLastYear > 0
        ? ((recordsThisYear - recordsLastYear) / recordsLastYear) * 100
        : null;
    const monthChange =
      recordsLastMonth > 0
        ? ((recordsThisMonth - recordsLastMonth) / recordsLastMonth) * 100
        : null;
    const weekChange =
      recordsLastWeek > 0
        ? ((recordsThisWeek - recordsLastWeek) / recordsLastWeek) * 100
        : null;

    return {
      totalRecords,
      recordsThisYear,
      recordsThisMonth,
      recordsThisWeek,
      lastRecordCreated: lastRecord ? lastRecord.createdAt : null,
      yearChange,
      monthChange,
      weekChange,
    };
  }
}

/**
 * Filters a record payload and strips out data that is not supported by your model's attributes types.
 * This helps prevent unwanted data from being created/updated on the backend
 */
function filterRecordPayload(fields: AdminModelField[], data: object): object {
  const filtered = {};

  Object.keys(data).forEach((key) => {
    const isValid = fields.some((field) => {
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

function buildWhereClause(filters: Filter[]) {
  const where: any = {};

  filters.forEach((filter) => {
    const { field, operator, value, type } = filter;

    let formattedValue;

    if (type === AdminFilterType.DATE && value) {
      // Convert the date string to a Date object to help prisma parse and filter later
      const dateValue = new Date(value);

      if (operator === AdminFilterOperator.EQUALS) {
        formattedValue = dateValue;
      } else if (operator === AdminFilterOperator.GREATER_THAN) {
        formattedValue = { gt: dateValue };
      } else if (operator === AdminFilterOperator.LESS_THAN) {
        formattedValue = { lt: dateValue };
      }
    } else if (type === AdminFilterType.BOOLEAN) {
      formattedValue = value === 'true';
    } else if (type === AdminFilterType.NUMBER) {
      if (operator === AdminFilterOperator.EQUALS) {
        formattedValue = parseFloat(value);
      } else if (operator === AdminFilterOperator.GREATER_THAN) {
        formattedValue = { gt: parseFloat(value) };
      } else if (operator === AdminFilterOperator.LESS_THAN) {
        formattedValue = { lt: parseFloat(value) };
      }
    } else {
      // Handle other types and operators
      switch (operator) {
        case AdminFilterOperator.CONTAINS:
          formattedValue = { contains: value, mode: 'insensitive' };
          break;
        case AdminFilterOperator.STARTS_WITH:
          formattedValue = { startsWith: value, mode: 'insensitive' };
          break;
        case AdminFilterOperator.ENDS_WITH:
          formattedValue = { endsWith: value, mode: 'insensitive' };
          break;
        case AdminFilterOperator.EQUALS:
          formattedValue = value;
          break;
        default:
          formattedValue = value;
          break;
      }
    }

    where[field] = formattedValue;
  });

  return where;
}
