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
import {
  checkBffSession,
  login as apiLogin,
  loginWithBff,
  logout as apiLogout,
  logoutBffSession,
  refresh as apiRefresh,
  refreshBffSession,
} from '@/lib/api/auth';
import { AUTH_MODE } from '@/lib/constants';
import { useTenant } from '@/lib/tenant/TenantProvider';
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
const BFF_SESSION = 'cookie-session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { tenantId } = useTenant();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (AUTH_MODE === 'bff') {
      void checkBffSession()
        .then(() => setAccessToken(BFF_SESSION))
        .catch(() => setAccessToken(null))
        .finally(() => setIsLoading(false));
      return;
    }

    queueMicrotask(() => {
      setAccessToken(getAccessToken());
      setIsLoading(false);
    });

    const handleUpdated = (event: Event) => {
      const detail = (event as CustomEvent<{ accessToken: string }>).detail;
      setAccessToken(detail.accessToken);
    };
    const handleCleared = () => setAccessToken(null);

    window.addEventListener('auth:updated', handleUpdated);
    window.addEventListener('auth:cleared', handleCleared);
    return () => {
      window.removeEventListener('auth:updated', handleUpdated);
      window.removeEventListener('auth:cleared', handleCleared);
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (AUTH_MODE === 'bff') {
      await loginWithBff(email, password, tenantId);
      setAccessToken(BFF_SESSION);
      return;
    }

    const result = await apiLogin(email, password, tenantId);
    setTokens(result.accessToken, result.refreshToken);
    setAccessToken(result.accessToken);
  }, [tenantId]);

  const logout = useCallback(async () => {
    if (AUTH_MODE === 'bff') {
      try {
        await logoutBffSession();
      } finally {
        setAccessToken(null);
      }
      return;
    }

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
    if (AUTH_MODE === 'bff') {
      try {
        await refreshBffSession();
        setAccessToken(BFF_SESSION);
        return true;
      } catch {
        setAccessToken(null);
        return false;
      }
    }

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
