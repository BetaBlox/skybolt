
import { DMMF, getPrismaModels } from "database";
import React, { createContext } from "react";

export type PrismaContextType = {
  models: DMMF.Model[];
  getPrismaModel: (modelName: string) => DMMF.Model;
  getPrismaField: (modelName: string, fieldName: string) => DMMF.Field
};

export const PrismaContext = createContext<PrismaContextType | null>(null);


interface Props {
  children: React.ReactElement | JSX.Element;
  models: DMMF.Model[];
}

export default function PrismaProvider({ children, models }: Props) {

  function getPrismaModel(modelName: string): DMMF.Model {
    const model = getPrismaModels().find(
      (m: DMMF.Model) => m.name.toLowerCase() === modelName.toLowerCase(),
    );

    if (!model) {
      throw new Error("MODEL_NOT_FOUND");
    }

    return model;
  }

  function getPrismaField(modelName: string, fieldName: string): DMMF.Field {
    const prismaModel = getPrismaModel(modelName);

    const field = prismaModel?.fields.find(
      (f) => f.name.toLowerCase() === fieldName.toLowerCase(),
    );

    if (!field) {
      throw new Error("FIELD_NOT_FOUND");
    }

    return field;
  }

  return (
    <PrismaContext.Provider
      value={{
          models,
          getPrismaModel,
          getPrismaField,
        }}
      >
      {children}
    </PrismaContext.Provider>
  );
}