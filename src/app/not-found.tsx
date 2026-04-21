'use client';

import {
  PortfolioProvider,
  usePortfolioContext,
} from '@/contexts/portfolio-context';
import ErrorPage from '@/components/error';
import { PAGE_NOT_FOUND_ERROR } from '@/constants/errors';
import { useConfigData } from '@/contexts/providers';
import { LOCAL_STORAGE_KEY_NAME } from '@/constants';
import { useEffect } from 'react';

const PageContent = () => {
  const error = PAGE_NOT_FOUND_ERROR;
  const { theme } = usePortfolioContext();

  useEffect(() => {
    if (theme) document.documentElement.setAttribute('data-theme', theme);
    if (theme && typeof window !== 'undefined')
      localStorage.setItem(LOCAL_STORAGE_KEY_NAME, theme);
  }, [theme]);

  return (
    <ErrorPage
      status={error.status}
      title={error.title}
      subTitle={error.subTitle}
      cta={error.cta}
    />
  );
};

export default function NotFoundPage() {
  const config = useConfigData();

  return (
    <PortfolioProvider config={config}>
      <PageContent />
    </PortfolioProvider>
  );
}
