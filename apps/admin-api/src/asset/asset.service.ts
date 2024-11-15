import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '@/supabase/supabase.service';
import { Asset } from '@repo/database';
import { FieldType } from '@repo/types/admin';
import { getDashboard } from '@repo/admin-config';

@Injectable()
export class AssetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabase: SupabaseService,
  ) {}

  async saveAsset(assetData: {
    modelName: string;
    recordId: number;
    fileName: string;
    fileUrl: string;
    fileType: string;
    size: number;
  }) {
    return this.prisma.asset.create({
      data: {
        modelName: assetData.modelName,
        recordId: assetData.recordId,
        fileName: assetData.fileName,
        fileUrl: assetData.fileUrl,
        fileType: assetData.fileType,
        size: assetData.size,
      },
    });
  }

  async attachAssetToRecord(
    modelName: string,
    recordId: number,
    assetField: string,
    asset: Asset,
  ): Promise<unknown> {
    const dashboard = getDashboard(modelName);
    const attrType = dashboard.attributeTypes.find(
      (attr) => attr.name === assetField && attr.type === FieldType.IMAGE,
    );

    if (attrType.type !== FieldType.IMAGE) {
      throw new BadRequestException(`No asset field found for ${assetField}`);
    }

    // Dynamically update the record with the file URL in the corresponding field
    return this.prisma[modelName].update({
      where: { id: recordId },
      data: { [attrType.sourceKey]: asset.id },
    });
  }

  async getAsset(assetId: number): Promise<Asset> {
    const asset = await this.prisma.asset.findUnique({
      where: { id: assetId },
    });

    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    return asset;
  }

  async deleteAsset(assetId: number) {
    const asset = await this.prisma.asset.findUnique({
      where: { id: assetId },
    });

    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    // Remove file from Supabase
    await this.supabase.deleteFile(asset.fileUrl);

    // Remove metadata from database
    return this.prisma.asset.delete({
      where: { id: assetId },
    });
  }
}
