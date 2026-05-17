import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserProfile, UserRole } from "@/types";
import api from "@/services/api";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          // Assume there is a /profile/ or /me/ endpoint to get the current user
          const response = await api.get('/profile/');
          setUser(response.data);
        } catch (err) {
          console.error("Failed to fetch user profile", err);
          localStorage.removeItem('access_token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: any) => {
    setError(null);
    try {
      const response = await api.post('/login/', credentials);
      const { access, user: userData } = response.data;
      localStorage.setItem('access_token', access);
      setUser(userData);
    } catch (err: any) {
      const message = err.response?.data?.detail || "Login failed. Please check your credentials.";
      setError(message);
      throw err;
    }
  };

  const register = async (data: any) => {
    setError(null);
    try {
      const response = await api.post('/register/', data);
      const { access, user: userData } = response.data;
      localStorage.setItem('access_token', access);
      setUser(userData);
    } catch (err: any) {
      const message = err.response?.data?.detail || "Registration failed. Please try again.";
      setError(message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, register, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
