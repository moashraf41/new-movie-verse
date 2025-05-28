import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Cookies.get("isLoggedIn") === "true";
  });
  const [isHeader, setIsHeader] = useState(false);

  useEffect(() => {
    const stored = Cookies.get("isLoggedIn");
    if (stored === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const login = ({ email, password }) => {
    if (email === "admin@movie.com" && password === "admin@12345") {
      Cookies.set("isLoggedIn", "true", { path: "/" });
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, message: "Invalid credentials" };
  };

  const logout = () => {
    Cookies.remove("isLoggedIn", { path: "/" });
    setIsAuthenticated(false);
  };

  return children;
};
