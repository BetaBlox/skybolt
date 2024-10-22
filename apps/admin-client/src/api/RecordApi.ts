import { AssetApi } from '@/api/AssetApi';
import { customFetch, HttpMethod } from '@/common/custom-fetcher';
import { Filter } from '@/widgets/models/filter-form';
import { getDashboard } from '@repo/admin-config';
import { Asset } from '@repo/database';
import {
  AdminFieldType,
  AdminRecord,
  AdminRecordPayload,
  SortDirection,
  SortOrder,
} from '@repo/types';
import { routeWithParams } from '@repo/utils';

export type RecordCreatePayload = {
  [key: string]: unknown;
};

export type RecordUpdatePayload = {
  id: number;
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

  create: async (
    modelName: string,
    data: RecordCreatePayload,
  ): Promise<AdminRecordPayload> => {
    const dashboard = getDashboard(modelName);

    // Initialize objects for JSON and file attributes
    const jsonPayload: RecordCreatePayload = {};
    const assetsToCreate: { assetField: string; file: File }[] = [];

    const keys = Object.keys(data);

    // Loop through the dashboard attributes and split the file fields from the rest
    keys.forEach((key) => {
      const value = data[key];
      const attributeType = dashboard.attributeTypes.find(
        (attributeType) => attributeType.name === key,
      );

      if (!attributeType) {
        throw new Error(`Attribute ${key} not found in the dashboard.`);
      }

      const isFileAttribute = attributeType.type === AdminFieldType.IMAGE;
      const isJsonData = !isFileAttribute;

      if (isFileAttribute && value instanceof File) {
        assetsToCreate.push({
          assetField: key,
          file: value,
        });
      } else if (isJsonData) {
        jsonPayload[key] = value;
      }
    });

    const createUrl = routeWithParams('/api/records/:modelName', {
      modelName,
    });
    const { response, data: adminRecordPayload } = await customFetch(
      createUrl,
      {
        method: HttpMethod.POST,
        body: JSON.stringify(jsonPayload),
      },
    );

    // Check if the record creation was successful before proceeding
    if (!response.ok) {
      throw new Error('Failed to create the record.');
    }

    const createPayload = adminRecordPayload as AdminRecordPayload;

    // If there are no files to upload, return the created record directly
    if (assetsToCreate.length === 0) {
      return createPayload;
    }

    await AssetApi.createMany(modelName, createPayload.record, assetsToCreate);

    const { data: updatedRecord } = await RecordApi.findOne(
      modelName,
      createPayload.record.id,
    );
    return updatedRecord;
  },

  update: async (
    modelName: string,
    record: AdminRecord,
    updates: RecordUpdatePayload,
    assets: {
      [key: string]: {
        asset: Asset | null;
        action: 'create' | 'delete' | 'none';
        file: File | null;
      };
    },
  ): Promise<AdminRecordPayload> => {
    // 1. Process regular form data (JSON)
    const url = routeWithParams('/api/records/:modelName/:id', {
      modelName,
      id: String(record.id),
    });
    const jsonRes = await customFetch(url, {
      method: HttpMethod.PUT,
      body: JSON.stringify(updates),
    });

    if (!jsonRes.response.ok) {
      throw new Error('Failed to update the record.');
    }

    // 2. Process assets
    const promises = Object.keys(assets).map(async (key) => {
      const assetData = assets[key];

      switch (assetData.action) {
        case 'create':
          if (!assetData.file) {
            throw new Error('No file provided for asset creation.');
          }

          await AssetApi.create(modelName, record, key, assetData.file);
          break;
        case 'delete':
          if (!assetData.asset) {
            throw new Error('No asset provided for deletion.');
          }
          await AssetApi.delete(assetData.asset.id);
          break;
        case 'none':
        default:
          break;
      }
    });

    // Wait for all asset-related operations to complete
    await Promise.all(promises);

    const { data: updatedRecord } = await RecordApi.findOne(
      modelName,
      record.id,
    );
    return updatedRecord;
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
