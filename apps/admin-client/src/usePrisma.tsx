import { useContext } from "react";
import { PrismaContext } from "./PrismaProvider";

export const usePrisma = () => {
  return useContext(PrismaContext);
};