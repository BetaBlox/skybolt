import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/models')
  getModels() {
    return this.appService.getModels();
  }

  @Get('/models/:modelName')
  getModel(@Param('modelName') modelName: string) {
    return this.appService.getModel(modelName);
  }
}
