import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {}

  getHello(): string {
    return 'Hello from the Admin Api!';
  }
}
