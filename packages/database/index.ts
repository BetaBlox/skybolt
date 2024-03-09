import { PrismaClient } from '@prisma/client';
import { DMMF } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';

export { DMMF } from '@prisma/client/runtime/library';
export { Prisma } from '@prisma/client';
export * from '@prisma/client';

let connection: PrismaClient | null = null;

export function getConnection(): PrismaClient {
  if (connection) {
    return connection;
  }

  connection = new PrismaClient();
  return connection;
}

export function getPrismaModel(modelName: string): DMMF.Model {
  const model = Prisma.dmmf.datamodel.models.find(
    (model) => model.name.toLowerCase() === modelName.toLowerCase(),
  );

  if (!model) {
    throw new Error(`Unable to find Prisma config for model: ${modelName}`);
  }

  return model;
}
