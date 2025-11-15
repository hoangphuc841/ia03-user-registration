import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { refreshAuthToken } from '@/lib/api'

interface User {
  email: string;
  sub: string;
}

interface LoginData {
  access_token: string;
  refresh_token: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: LoginData) => void;
  logout: () => void;
  isLoading: boolean;
  sessionExpired: boolean;
  clearSessionExpired: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeToken(token: string): User | null {
  try {
    const decoded: User & { exp: number } = jwtDecode(token);
    // Check if token is expired
    if (decoded.exp * 1000 > Date.now()) {
      return decoded;
    }
    return null; // Token is expired
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    (async () => {
      const storedToken = localStorage.getItem('token');
      const storedRefreshToken = localStorage.getItem('refreshToken');

      try {
        if (storedToken) {
          const decodedUser = decodeToken(storedToken);
          if (decodedUser) {
            // Case 1: Valid
            setUser(decodedUser);
            setToken(storedToken);
          } else if (storedRefreshToken) {
            // Case 2: Expired, use new function
            const newAccessToken = await refreshAuthToken(storedRefreshToken);
            const newDecodedUser = decodeToken(newAccessToken);
            if (newDecodedUser) {
              setUser(newDecodedUser);
              setToken(newAccessToken);
            }
          } else {
            // Case 3: Expired, no refresh
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
          }
        }
      } catch (error) {
        // Case 5: Refresh failed
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setToken(null);
        setSessionExpired(true);
      } finally {
        setIsLoading(false);
      }
    })();

    // Add storage event listener
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        const newToken = e.newValue;
        if (newToken) {
          const decodedUser = decodeToken(newToken);
          if (decodedUser) {
            setUser(decodedUser);
            setToken(newToken);
          }
        } else {
          // Token was removed (logout from another tab or interceptor)
          setUser(null);
          setToken(null);
          localStorage.removeItem('refreshToken'); // Ensure refresh token is also cleared
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = (data: LoginData) => {
    const decodedUser = decodeToken(data.access_token);
    if (decodedUser) {
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('refreshToken', data.refresh_token);
      setUser(decodedUser);
      setToken(data.access_token);
    } else {
      console.error("Failed to decode token on login");
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setToken(null);
    setSessionExpired(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, sessionExpired, clearSessionExpired: () => setSessionExpired(false) }}>
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