'use client';

import { usePortfolioContext } from '@/contexts/portfolio-context';
import { renderOverviewPage } from '@/components/pages/overview';

export default function OverviewPage() {
  const { sanitizedConfig, profile, readme, socialLinks } =
    usePortfolioContext();
  return renderOverviewPage({ sanitizedConfig, profile, readme, socialLinks });
}
