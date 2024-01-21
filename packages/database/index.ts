import { Prisma } from "@prisma/client";
import { DMMF } from "@prisma/client/runtime/library";

export { DMMF } from "@prisma/client/runtime/library";
export * from "@prisma/client";
export { Prisma } from "@prisma/client";

// export function getPrismaModels(): DMMF.Model[] {
//   return Prisma.dmmf.datamodel.models;
// }

// export function getPrismaModel(modelName: string): DMMF.Model {
//   const models = getPrismaModels();
//   const model = models.find(
//     (m: any) => m.name.toLowerCase() === modelName.toLowerCase()
//   );

//   if (!model) {
//     throw new Error("MODEL_NOT_FOUND");
//   }

//   return model;
// }

// export function getPrismaField(
//   modelName: string,
//   fieldName: string
// ): DMMF.Field {
//   const prismaModel = getPrismaModel(modelName);

//   const field = prismaModel?.fields.find(
//     (f) => f.name.toLowerCase() === fieldName.toLowerCase()
//   );

//   if (!field) {
//     throw new Error("FIELD_NOT_FOUND");
//   }

//   return field;
// }
