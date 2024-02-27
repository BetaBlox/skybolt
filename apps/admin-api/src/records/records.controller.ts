import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { AdminAttributeType } from '@/config/admin';
import { DMMF } from 'database';

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Get('/:modelName')
  findMany(@Param('modelName') modelName: string): Promise<{
    prismaModelConfig: DMMF.Model;
    attributeTypes: AdminAttributeType[];
    collectionAttributes: string[];
    showAttributes: string[];
    formAttributes: string[];
    records: any[] & {
      displayName: string;
    };
  }> {
    return this.recordsService.findMany(modelName);
  }

  @Get('/:modelName/:id')
  findOne(
    @Param('modelName') modelName: string,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{
    prismaModelConfig: DMMF.Model;
    attributeTypes: AdminAttributeType[];
    collectionAttributes: string[];
    showAttributes: string[];
    formAttributes: string[];
    record: any;
    displayName: string;
  }> {
    return this.recordsService.getRecord(modelName, id);
  }

  @Post('/:modelName')
  create(
    @Param('modelName') modelName: string,
    @Body() data: object,
  ): Promise<{
    prismaModelConfig: DMMF.Model;
    attributeTypes: AdminAttributeType[];
    collectionAttributes: string[];
    showAttributes: string[];
    formAttributes: string[];
    record: any;
    displayName: string;
  }> {
    return this.recordsService.createRecord(modelName, data);
  }

  @Put('/:modelName/:id')
  update(
    @Param('modelName') modelName: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: object,
  ): Promise<{
    prismaModelConfig: DMMF.Model;
    attributeTypes: AdminAttributeType[];
    collectionAttributes: string[];
    showAttributes: string[];
    formAttributes: string[];
    record: any;
    displayName: string;
  }> {
    return this.recordsService.updateRecord(modelName, id, data);
  }
}
