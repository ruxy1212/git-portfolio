'use client';

import { usePortfolioContext } from '@/contexts/portfolio-context';
import { renderInsightsPage } from '@/components/pages/insights';

export default function InsightsPage() {
  const { sanitizedConfig, loading } = usePortfolioContext();
  return renderInsightsPage({ sanitizedConfig, loading });
}
