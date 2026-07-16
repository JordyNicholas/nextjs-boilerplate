'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { login as apiLogin, logout as apiLogout, refresh as apiRefresh } from '@/lib/api/auth';
import { DEFAULT_TENANT_ID } from '@/lib/constants';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from '@/lib/auth/storage';

type AuthState = {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setAccessToken(getAccessToken());
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiLogin(email, password, DEFAULT_TENANT_ID);
    setTokens(result.accessToken, result.refreshToken);
    setAccessToken(result.accessToken);
  }, []);

  const logout = useCallback(async () => {
    const token = getAccessToken();
    const refreshToken = getRefreshToken();
    if (token) {
      try {
        await apiLogout(token, refreshToken ?? undefined);
      } catch {
        // Clear local session even if API logout fails
      }
    }
    clearTokens();
    setAccessToken(null);
  }, []);

  const refreshSession = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;
    try {
      const result = await apiRefresh(refreshToken);
      setTokens(result.accessToken, result.refreshToken);
      setAccessToken(result.accessToken);
      return true;
    } catch {
      clearTokens();
      setAccessToken(null);
      return false;
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      isAuthenticated: Boolean(accessToken),
      isLoading,
      login,
      logout,
      refreshSession,
    }),
    [accessToken, isLoading, login, logout, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
