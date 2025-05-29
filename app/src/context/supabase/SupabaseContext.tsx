import { createContext } from "react";
import type { SupbaseContextType } from "./SupabaseContextType";

// Create the context with an empty object as default value
export const SupabaseContext = createContext<SupbaseContextType | undefined>(
  undefined
);
