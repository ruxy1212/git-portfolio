'use client';

import { usePortfolioContext } from '@/contexts/portfolio-context';
import { renderPackagesPage } from '@/components/pages/packages';

export default function PackagesPage() {
  const { sanitizedConfig, loading } = usePortfolioContext();
  return renderPackagesPage({ sanitizedConfig, loading });
}
