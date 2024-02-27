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
import { DMMF } from '@repo/database';
import { AdminRecordPayload, AdminRecordsPayload } from '@repo/types';

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Get('/:modelName')
  findMany(
    @Param('modelName') modelName: string,
  ): Promise<AdminRecordsPayload> {
    return this.recordsService.findMany(modelName);
  }

  @Get('/:modelName/:id')
  findOne(
    @Param('modelName') modelName: string,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AdminRecordPayload> {
    return this.recordsService.getRecord(modelName, id);
  }

  @Post('/:modelName')
  create(
    @Param('modelName') modelName: string,
    @Body() data: object,
  ): Promise<AdminRecordPayload> {
    return this.recordsService.createRecord(modelName, data);
  }

  @Put('/:modelName/:id')
  update(
    @Param('modelName') modelName: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: object,
  ): Promise<AdminRecordPayload> {
    return this.recordsService.updateRecord(modelName, id, data);
  }
}
