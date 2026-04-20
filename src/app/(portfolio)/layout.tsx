'use client';

import { type ReactNode } from 'react';
import {
  PortfolioProvider,
  usePortfolioContext,
} from '@/contexts/portfolio-context';
import { Header } from '@/components/header';
import Footer from '@/components/footer';
import ErrorPage from '@/components/error';
import { BG_COLOR } from '@/constants';
import { useConfigData } from '@/contexts/providers';

function InnerContent({ children }: { children: ReactNode }) {
  const {
    error,
    sanitizedConfig,
    loading,
    repositoryOwner,
    portfolioRepository,
    profile,
    repositoryUrl,
    repositoriesUrl,
    issuesUrl,
    starsUrl,
    repoStat,
    unifiedProjects,
    theme,
    setTheme,
  } = usePortfolioContext();

  if (error) {
    return (
      <ErrorPage
        status={error.status}
        title={error.title}
        subTitle={error.subTitle}
      />
    );
  }

  return (
    <div className="fade-in min-h-screen flex flex-col">
      <div className={`grow ${BG_COLOR}`}>
        <Header
          repositoryOwner={repositoryOwner}
          portfolioRepository={portfolioRepository}
          profile={profile}
          repositoryUrl={repositoryUrl}
          repositoriesUrl={repositoriesUrl}
          issuesUrl={issuesUrl}
          starsUrl={starsUrl}
          repoStat={repoStat}
          sanitizedConfig={sanitizedConfig}
          unifiedProjects={unifiedProjects}
          theme={theme}
          setTheme={setTheme}
        />
        <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6">{children}</main>
      </div>

      {sanitizedConfig.footer && (
        <footer
          className={`p-4 shrink-0 footer ${BG_COLOR} text-base-content footer-center`}
        >
          <div className="card card-sm bg-base-100 shadow-sm">
            <Footer content={sanitizedConfig.footer} loading={loading} />
          </div>
        </footer>
      )}
    </div>
  );
}

export default function PortfolioLayout({ children }: { children: ReactNode }) {
  const config = useConfigData();
  return (
    <PortfolioProvider config={config}>
      <InnerContent>{children}</InnerContent>
    </PortfolioProvider>
  );
}
