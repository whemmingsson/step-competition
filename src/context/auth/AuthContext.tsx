import { createContext } from "react";
import type { AuthContextType } from "./AuthContextType";

// Create the context with an empty object as default value
export const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
});
