// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  email: string;
  sub: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for a token in localStorage when the app loads
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded: User & { exp: number } = jwtDecode(storedToken);
        // Check if token is expired
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
          setToken(storedToken);
        } else {
          // Token is expired
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error("Failed to decode token", error);
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string) => {
    try {
      const decoded: User = jwtDecode(newToken);
      localStorage.setItem('token', newToken);
      setUser(decoded);
      setToken(newToken);
    } catch (error) {
      console.error("Failed to decode token on login", error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}