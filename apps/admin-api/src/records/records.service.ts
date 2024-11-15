import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Dashboard, getDashboard, getHookConfig } from '@repo/admin-config';
import { paginator } from '@repo/paginator';
import { PrismaAdapter } from '@repo/database';
import { Filter } from '@/records/types';
import { snakeCase } from '@repo/utils';
import { PaginatedResult, PaginateFunction } from '@repo/types/pagination';
import { SortDirection, SortOrder } from '@repo/types/sort';
import {
  FieldType,
  FilterOperator,
  FilterType,
  ModelField,
  RecordPayload,
  RecordsPayload,
} from '@repo/types/admin';

const paginate: PaginateFunction = paginator();

@Injectable()
export class RecordsService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    modelName: string,
    page: number,
    perPage: number,
    filters: Filter[] = [],
    sortField: string = 'id',
    sortOrder: SortOrder = SortDirection.DESC,
  ): Promise<RecordsPayload> {
    const dashboard = getDashboard(modelName);
    const where = buildWhereClause(filters, modelName);
    const include = buildIncludeClause(dashboard);
    const orderBy = buildOrderByClause(sortField, sortOrder, dashboard);

    const paginatedResult: PaginatedResult<unknown> = await paginate(
      this.prisma[modelName],
      {
        include,
        where,
        orderBy,
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

  async getRecord(modelName: string, id: number): Promise<RecordPayload> {
    const dashboard = getDashboard(modelName);
    const include = buildIncludeClause(dashboard);

    const record = await this.prisma[modelName].findFirst({
      where: { id },
      include,
    });

    const adapter = new PrismaAdapter();

    return {
      modelName,
      fields: adapter.getFields(modelName),
      record,
    };
  }

  async createRecord(modelName: string, data: object): Promise<RecordPayload> {
    const adapter = new PrismaAdapter();
    const fields = adapter.getFields(modelName);
    const dashboard = getDashboard(modelName);
    const hook = getHookConfig(modelName);

    if (dashboard.isCreatable() === false) {
      throw new Error('Record is not creatable');
    }

    let payload = filterRecordPayload(fields, data);

    payload = await hook.beforeCreate(payload);

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
  ): Promise<RecordPayload> {
    const adapter = new PrismaAdapter();
    const fields = adapter.getFields(modelName);
    const dashboard = getDashboard(modelName);
    const hook = getHookConfig(modelName);

    let record = await this.prisma[modelName].findFirstOrThrow({
      where: {
        id,
      },
    });

    if (dashboard.isEditable(record) === false) {
      throw new Error('Record is not editable');
    }

    let payload = filterRecordPayload(fields, data);

    payload = await hook.beforeUpdate(payload);

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
    const dashboard = getDashboard(modelName);
    const hook = getHookConfig(modelName);

    const record = await this.prisma[modelName].findFirstOrThrow({
      where: {
        id,
      },
    });

    if (dashboard.isDeletable(record) === false) {
      throw new Error('Record is not deletable');
    }

    await hook.beforeDelete(record);

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
        createdAt: SortDirection.DESC,
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
function filterRecordPayload(fields: ModelField[], data: object): object {
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

function buildWhereClause(filters: Filter[], currentModelName: string) {
  const where: any = {};

  filters.forEach((filter) => {
    const { field, operator, value, type } = filter;
    const modelName = snakeCase(filter.modelName);

    let formattedValue: unknown;

    // Handle the date filter type
    if (type === FilterType.DATE && value) {
      const dateValue = new Date(value);
      if (operator === FilterOperator.EQUALS) {
        formattedValue = dateValue;
      } else if (operator === FilterOperator.GREATER_THAN) {
        formattedValue = { gt: dateValue };
      } else if (operator === FilterOperator.LESS_THAN) {
        formattedValue = { lt: dateValue };
      }
    } else if (type === FilterType.BOOLEAN) {
      formattedValue = value === 'true';
    } else if (type === FilterType.NUMBER) {
      if (operator === FilterOperator.EQUALS) {
        formattedValue = parseFloat(value);
      } else if (operator === FilterOperator.GREATER_THAN) {
        formattedValue = { gt: parseFloat(value) };
      } else if (operator === FilterOperator.LESS_THAN) {
        formattedValue = { lt: parseFloat(value) };
      }
    } else {
      // Handle other types and operators
      switch (operator) {
        case FilterOperator.CONTAINS:
          formattedValue = { contains: value, mode: 'insensitive' };
          break;
        case FilterOperator.STARTS_WITH:
          formattedValue = { startsWith: value, mode: 'insensitive' };
          break;
        case FilterOperator.ENDS_WITH:
          formattedValue = { endsWith: value, mode: 'insensitive' };
          break;
        case FilterOperator.EQUALS:
          formattedValue = value;
          break;
        default:
          formattedValue = value;
          break;
      }
    }

    if (modelName.toLowerCase() === currentModelName.toLowerCase()) {
      // Assume that his filter is for our current model. We don't need to nest it
      where[field] = formattedValue;
    } else {
      // Set the filter into the correct nested object if it's a related model field
      where[modelName] = {
        ...where[modelName],
        [field]: formattedValue,
      };
    }
  });

  return where;
}

function buildIncludeClause(dashboard: Dashboard<unknown>) {
  const include = {};
  dashboard.attributeTypes.forEach((at) => {
    if (
      at.type === FieldType.RELATIONSHIP_HAS_ONE ||
      at.type === FieldType.IMAGE
    ) {
      include[at.name] = true;
    }
  });

  return include;
}

function buildOrderByClause(
  sortField: string,
  sortOrder: SortOrder,
  dashboard: Dashboard<unknown>,
) {
  // Ensure that the sortField exists within the model's attributes or use the default 'id' field
  const sortableAttributes = ['id', ...dashboard.collectionAttributes];

  const isValid = sortableAttributes.includes(sortField);

  if (!isValid) {
    console.warn(`Invalid sortField: ${sortField}. Defaulting to 'id' field`);
    return { id: SortDirection.DESC };
  }

  return { [sortField]: sortOrder };
}
