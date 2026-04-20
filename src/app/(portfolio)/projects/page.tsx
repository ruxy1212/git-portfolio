'use client';
import { useState } from 'react';
import { usePortfolioContext } from '@/contexts/portfolio-context';
import { ProjectsTab } from '@/components/pages/projects';

export default function ProjectsPage() {
  const { unifiedProjects, sanitizedConfig } = usePortfolioContext();
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(
    null,
  );

  return (
    <ProjectsTab
      lastToFirst={sanitizedConfig.projects.lastToFirst}
      unifiedProjects={unifiedProjects}
      expandedProjectId={expandedProjectId}
      setExpandedProjectId={setExpandedProjectId}
      screenshotApi={sanitizedConfig.projects.github.screenshotApi}
    />
  );
}
