import { customFetch, HttpMethod } from '@/common/custom-fetcher';
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
    search: string = '',
  ) => {
    const url = routeWithParams('/api/records/:modelName', {
      modelName,
      page: String(page),
      perPage: String(perPage),
      search,
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
};
