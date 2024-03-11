import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { AdminRecordPayload, AdminRecordsPayload } from '@repo/types';
import { AccessTokenGuard } from '@/common/guards/accessToken.guard';
import { defaultPerPage } from '@repo/paginator';

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @UseGuards(AccessTokenGuard)
  @Get('/:modelName')
  async findMany(
    @Param('modelName') modelName: string,
    @Query('search') search: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(defaultPerPage), ParseIntPipe)
    perPage: number,
  ): Promise<AdminRecordsPayload> {
    return this.recordsService.findMany(modelName, search, page, perPage);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/:modelName/:id')
  async findOne(
    @Param('modelName') modelName: string,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AdminRecordPayload> {
    return this.recordsService.getRecord(modelName, id);
  }

  @UseGuards(AccessTokenGuard)
  @Post('/:modelName')
  async create(
    @Param('modelName') modelName: string,
    @Body() data: object,
  ): Promise<AdminRecordPayload> {
    return this.recordsService.createRecord(modelName, data);
  }

  @UseGuards(AccessTokenGuard)
  @Put('/:modelName/:id')
  async update(
    @Param('modelName') modelName: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: object,
  ): Promise<AdminRecordPayload> {
    return this.recordsService.updateRecord(modelName, id, data);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:modelName/:id')
  async delete(
    @Param('modelName') modelName: string,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<boolean> {
    return this.recordsService.deleteRecord(modelName, id);
  }
}
