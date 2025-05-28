import { createContext } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  login: () => {},
  logout: () => {},
  isHeader: false,
  setIsHeader: () => {},
});
