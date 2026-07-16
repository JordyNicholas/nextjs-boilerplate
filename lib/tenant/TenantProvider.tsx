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
import { DEFAULT_TENANT_ID } from '@/lib/constants';

const TENANT_STORAGE_KEY = 'ts-monolith:tenantId';

type TenantContextValue = {
  tenantId: string;
  setTenantId: (tenantId: string) => void;
  resetTenant: () => void;
};

const TenantContext = createContext<TenantContextValue | null>(null);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenantId, setTenantIdState] = useState(DEFAULT_TENANT_ID);

  useEffect(() => {
    queueMicrotask(() => {
      setTenantIdState(localStorage.getItem(TENANT_STORAGE_KEY) ?? DEFAULT_TENANT_ID);
    });
  }, []);

  const setTenantId = useCallback((value: string) => {
    const next = value.trim() || DEFAULT_TENANT_ID;
    localStorage.setItem(TENANT_STORAGE_KEY, next);
    setTenantIdState(next);
  }, []);

  const resetTenant = useCallback(() => {
    localStorage.removeItem(TENANT_STORAGE_KEY);
    setTenantIdState(DEFAULT_TENANT_ID);
  }, []);

  const value = useMemo(
    () => ({ tenantId, setTenantId, resetTenant }),
    [tenantId, setTenantId, resetTenant],
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
}
