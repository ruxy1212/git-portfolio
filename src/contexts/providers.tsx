'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { ProgressProvider } from '@bprogress/next/app';
import { SerwistProvider } from '@/app/serwist';

interface ConfigProviderProps {
  children: ReactNode;
  CONFIG: Config;
}

const ConfigContext = createContext<Config | null>(null);

export function ConfigProvider({ children, CONFIG }: ConfigProviderProps) {
  const enablePwa =
    Boolean(CONFIG.enablePWA) && process.env.NODE_ENV === 'production';

  if (enablePwa) {
    return (
      <SerwistProvider swUrl="/serwist/sw.js">
        <ConfigContext.Provider value={CONFIG}>
          <ProgressProvider
            height="3px"
            color="var(--color-base-content)"
            options={{ showSpinner: false }}
            shallowRouting
          >
            {children}
          </ProgressProvider>
        </ConfigContext.Provider>
      </SerwistProvider>
    );
  } else {
    return (
      <ConfigContext.Provider value={CONFIG}>
        <ProgressProvider
          height="4px"
          color="var(--color-base-content)"
          options={{ showSpinner: false }}
          shallowRouting
        >
          {children}
        </ProgressProvider>
      </ConfigContext.Provider>
    );
  }
}

export const useConfigData = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfigData must be used within a ConfigProvider');
  }
  return context;
};
