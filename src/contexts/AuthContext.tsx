import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, AuthTokens } from "@/lib/api";
import { getCurrentUser } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore auth from localStorage on mount
  useEffect(() => {
    const storedTokens = localStorage.getItem("auth_tokens");
    if (storedTokens) {
      try {
        const parsedTokens: AuthTokens = JSON.parse(storedTokens);
        setTokens(parsedTokens);

        // Verify token by fetching user
        getCurrentUser(parsedTokens.access)
          .then((userData) => {
            setUser(userData);
          })
          .catch(() => {
            // Token might be expired
            localStorage.removeItem("auth_tokens");
            setTokens(null);
          });
      } catch {
        localStorage.removeItem("auth_tokens");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User, authTokens: AuthTokens) => {
    setUser(userData);
    setTokens(authTokens);
    localStorage.setItem("auth_tokens", JSON.stringify(authTokens));
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem("auth_tokens");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
