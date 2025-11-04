import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authAPI, setAuthToken } from '../api/client';
import { deleteToken, deleteUser, getToken, getUser, saveToken, saveUser } from '../utils/storage';

type User = {
  id: number;
  name: string;
  email: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token) {
        setAuthToken(token);
        try {
          const profile = await authAPI.getProfile();
          setUser(profile.data.data || profile.data.user || null);
        } catch {
          await deleteToken();
          await deleteUser();
          setAuthToken(null);
        }
      }
      setLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authAPI.login({ email, password });
    const token: string = res.data?.token || res.data?.data?.token;
    // Apply token BEFORE calling protected endpoints
    setAuthToken(token);
    const profile = await authAPI.getProfile();
    const userData: User = (profile.data?.data?.user) || profile.data?.user;
    await saveToken(token);
    await saveUser(userData);
    setUser(userData);
  };

  const register = async (email: string, password: string) => {
    await authAPI.register({ email, password });
    // Registration doesn't auto-login, user needs to verify email
  };

  const logout = async () => {
    await deleteToken();
    await deleteUser();
    setAuthToken(null);
    setUser(null);
  };

  const value = useMemo<AuthContextType>(() => ({
    isAuthenticated: !!user,
    user,
    loading,
    login,
    register,
    logout
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


