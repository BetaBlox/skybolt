import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  async truncateDatabase() {
    const tableNames = ['User'];

    for (const tableName of tableNames) {
      await this.$queryRawUnsafe(
        `TRUNCATE "${tableName}" RESTART IDENTITY CASCADE;`,
      );
    }

    await this.$disconnect();
  }
}
