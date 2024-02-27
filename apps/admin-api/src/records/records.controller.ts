import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { AdminRecordPayload, AdminRecordsPayload } from '@repo/types';

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Get('/:modelName')
  async findMany(
    @Param('modelName') modelName: string,
  ): Promise<AdminRecordsPayload> {
    return this.recordsService.findMany(modelName);
  }

  @Get('/:modelName/:id')
  async findOne(
    @Param('modelName') modelName: string,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AdminRecordPayload> {
    return this.recordsService.getRecord(modelName, id);
  }

  @Post('/:modelName')
  async create(
    @Param('modelName') modelName: string,
    @Body() data: object,
  ): Promise<AdminRecordPayload> {
    return this.recordsService.createRecord(modelName, data);
  }

  @Put('/:modelName/:id')
  async update(
    @Param('modelName') modelName: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: object,
  ): Promise<AdminRecordPayload> {
    return this.recordsService.updateRecord(modelName, id, data);
  }

  @Delete('/:modelName/:id')
  async delete(
    @Param('modelName') modelName: string,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.recordsService.deleteRecord(modelName, id);
  }
}
