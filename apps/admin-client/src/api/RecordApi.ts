import { customFetch, HttpMethod } from '@/common/custom-fetcher';
import { Filter } from '@/widgets/models/filter-form';
import { SortDirection, SortOrder } from '@repo/types';
import { routeWithParams } from '@repo/utils';

type ApiCreatePayload = {
  [key: string]: unknown;
};

type ApiUpdatePayload = {
  [key: string]: unknown;
};

export const RecordApi = {
  findMany: async (
    modelName: string,
    page: number = 1,
    perPage: number = 20,
    filters: Filter[] = [],
    sortField: string = 'id',
    sortOrder: SortOrder = SortDirection.DESC,
  ) => {
    const url = routeWithParams('/api/records/:modelName', {
      modelName,
      page: String(page),
      perPage: String(perPage),
      filters: JSON.stringify(filters),
      sortField,
      sortOrder,
    });
    return customFetch(url, {
      method: HttpMethod.GET,
    });
  },

  findOne: async (modelName: string, id: number) => {
    const url = routeWithParams(`/api/records/:modelName/:id`, {
      modelName,
      id: String(id),
    });
    return customFetch(url, {
      method: HttpMethod.GET,
    });
  },

  create: async (modelName: string, data: ApiCreatePayload) => {
    const url = routeWithParams('/api/records/:modelName', {
      modelName,
    });
    return customFetch(url, {
      method: HttpMethod.POST,
      body: JSON.stringify(data),
    });
  },

  update: async (modelName: string, id: number, data: ApiUpdatePayload) => {
    const url = routeWithParams('/api/records/:modelName/:id', {
      modelName,
      id: String(id),
    });
    return customFetch(url, {
      method: HttpMethod.PUT,
      body: JSON.stringify(data),
    });
  },

  delete: async (modelName: string, id: number) => {
    const url = routeWithParams('/api/records/:modelName/:id', {
      modelName,
      id: String(id),
    });

    return customFetch(url, {
      method: HttpMethod.DELETE,
    });
  },

  registrations: async (modelName: string) => {
    const url = routeWithParams('/api/records/:modelName/registrations', {
      modelName,
    });
    return customFetch(url, {
      method: HttpMethod.GET,
    });
  },

  kpis: async (modelName: string) => {
    const url = routeWithParams('/api/records/:modelName/kpis', {
      modelName,
    });
    return customFetch(url, {
      method: HttpMethod.GET,
    });
  },
};
