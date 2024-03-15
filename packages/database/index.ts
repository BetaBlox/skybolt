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

export class PrismaAdapter {
  getModel(modelName: string): DMMF.Model {
    const model = Prisma.dmmf.datamodel.models.find(
      (model) => model.name.toLowerCase() === modelName.toLowerCase(),
    );

    if (!model) {
      throw new Error(`Unable to find Prisma config for model: ${modelName}`);
    }

    return model;
  }

  getFields(modelName: string): {
    name: string;
    isRequired: boolean;
  }[] {
    const model = this.getModel(modelName);
    return model.fields.map((field) => ({
      name: field.name,
      isRequired: field.isRequired,
      relationName: field.relationName,
    }));
  }
}
