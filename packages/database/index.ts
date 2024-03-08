export { DMMF } from '@prisma/client/runtime/library';
export * from '@prisma/client';
import { PrismaClient } from '@prisma/client';
export { Prisma } from '@prisma/client';

let connection: PrismaClient | null = null;

export function getConnection(): PrismaClient {
  if (connection) {
    return connection;
  }

  connection = new PrismaClient();
  return connection;
}
