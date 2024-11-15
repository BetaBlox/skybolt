import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Param,
  Delete,
  Get,
  ParseIntPipe,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AssetService } from './asset.service';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '@/asset/constants';
import { SupabaseService } from '@/supabase/supabase.service';
import { getDashboard } from '@repo/admin-config';
import { FieldType } from '@repo/types/admin';

@Controller('assets')
export class AssetController {
  constructor(
    private readonly assetService: AssetService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @Post('/upload/:modelName/:recordId')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
          return cb(new BadRequestException('Invalid file type'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  async uploadAsset(
    @UploadedFile() file: Express.Multer.File,
    @Param('modelName') modelName: string,
    @Param('recordId', ParseIntPipe) recordId: number,
    @Body() body: { assetField: string },
  ) {
    const { assetField } = body;

    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const dashboard = getDashboard(modelName);
    const assetAttribute = dashboard.attributeTypes.find(
      (attr) => attr.name === assetField && attr.type === FieldType.IMAGE,
    );

    if (!assetAttribute) {
      throw new BadRequestException(`No asset field found for ${assetField}`);
    }

    const filePath = await this.supabaseService.uploadFile(file); // Upload file to Supabase
    const asset = await this.assetService.saveAsset({
      modelName,
      recordId,
      fileName: file.originalname,
      fileUrl: filePath,
      fileType: file.mimetype,
      size: file.size,
    });
    const updatedRecord = await this.assetService.attachAssetToRecord(
      modelName,
      recordId,
      assetField,
      asset,
    );

    return updatedRecord;
  }

  @Get(':assetId')
  async getAsset(@Param('assetId', ParseIntPipe) assetId: number) {
    return this.assetService.getAsset(assetId);
  }

  @Delete(':assetId')
  async deleteAsset(@Param('assetId', ParseIntPipe) assetId: number) {
    return this.assetService.deleteAsset(assetId);
  }
}
