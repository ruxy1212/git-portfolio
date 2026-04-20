'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { ProgressProvider } from '@bprogress/next/app';

interface ConfigProviderProps {
  children: ReactNode;
  CONFIG: Config;
}

const ConfigContext = createContext<Config | null>(null);

export function ConfigProvider({ children, CONFIG }: ConfigProviderProps) {
  return (
    <ConfigContext.Provider value={CONFIG}>
      <ProgressProvider
        height="4px"
        color="#fffd00"
        options={{ showSpinner: false }}
        shallowRouting
      >
        {children}
      </ProgressProvider>
    </ConfigContext.Provider>
  );
}

export const useConfigData = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfigData must be used within a ConfigProvider');
  }
  return context;
};
