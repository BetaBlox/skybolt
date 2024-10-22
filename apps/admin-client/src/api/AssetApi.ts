import { ContentType, customFetch, HttpMethod } from '@/common/custom-fetcher';
import { Asset } from '@repo/database';
import { AdminRecord } from '@repo/types';
import { routeWithParams } from '@repo/utils';

export const AssetApi = {
  createMany: async (
    modelName: string,
    record: AdminRecord,
    fileData: { assetField: string; file: File }[],
  ): Promise<Asset[]> => {
    return Promise.all(
      fileData.map(({ assetField, file }) =>
        AssetApi.create(modelName, record, assetField, file),
      ),
    );
  },
  create: async (
    modelName: string,
    record: AdminRecord,
    assetField: string,
    file: File,
  ): Promise<Asset> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('assetField', assetField);

    const fileUploadUrl = routeWithParams(
      `/api/assets/upload/:modelName/:recordId`,
      {
        modelName,
        recordId: String(record.id),
      },
    );

    const uploadResponse = await customFetch(fileUploadUrl, {
      method: HttpMethod.POST,
      body: formData,
      headers: {
        'Content-Type': ContentType.MULTIPART_FORM,
      },
    });

    // Check if the file upload was successful
    if (!uploadResponse.response.ok) {
      throw new Error(`Failed to upload the file for ${assetField}.`);
    }

    return uploadResponse.data;
  },

  delete: async (assetId: number): Promise<void> => {
    const deleteUrl = routeWithParams(`/api/assets/:id`, {
      id: String(assetId),
    });

    const deleteResponse = await customFetch(deleteUrl, {
      method: HttpMethod.DELETE,
    });

    if (!deleteResponse.response.ok) {
      throw new Error('Failed to delete the asset.');
    }
  },
};
