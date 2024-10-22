import { IsNotEmpty, IsString } from 'class-validator';

export class UploadAssetDto {
  @IsNotEmpty()
  @IsString()
  assetField: string; // The column name to dynamically attach the asset (e.g., avatar, coverImage)
}
