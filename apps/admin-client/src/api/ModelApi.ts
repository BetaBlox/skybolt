import { customFetch, HttpMethod } from '@/common/custom-fetcher';
import { routeWithParams } from '@repo/utils';

export const ModelApi = {
  findMany: async () => {
    return customFetch('/api/models', {
      method: HttpMethod.GET,
    });
  },

  findOne: async (modelName: string) => {
    const url = routeWithParams(`/api/models/:modelName`, {
      modelName,
    });
    return customFetch(url, {
      method: HttpMethod.GET,
    });
  },
};
