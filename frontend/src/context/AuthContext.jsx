import { createContext, useState } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { name, phone, email, token }
  const [isAdmin, setIsAdmin] = useState(false);

  const login = (userData) => setUser(userData);
  const logout = () => {
    setUser(null);
    setIsAdmin(false);
  };
  const loginAsAdmin = (adminData) => {
    setUser(adminData);
    setIsAdmin(true);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout, loginAsAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}
