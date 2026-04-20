import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { SearchBar } from '../search/searchbar';
import {
  BookIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  GitPullRequestIcon,
  IssueOpenedIcon,
  MarkGithubIcon,
  PackageIcon,
  ProjectIcon,
  RepoIcon,
  SearchIcon,
  StarIcon,
  ThreeBarsIcon,
} from '@primer/octicons-react';
import type { SanitizedConfig } from '@/interfaces/sanitized-config';
import { useRouter } from '@bprogress/next/app';
import { usePathname } from 'next/navigation';
import type { Profile } from '@/interfaces';
import Image from 'next/image';

type AppTab = 'overview' | 'insights' | 'projects' | 'packages' | 'issues';

type RepoStat = {
  publicNonForkCount: number;
  totalStars: number;
};

type UnifiedProject = {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription?: string;
  year: string;
  stack: string[];
  categories?: string[];
  media: string[];
  link: string;
  repo: string;
};

interface HeaderProps {
  repositoryOwner: string;
  portfolioRepository?: string;
  profile: Profile | null;
  repositoryUrl: string;
  repositoriesUrl: string;
  issuesUrl: string;
  starsUrl: string;
  repoStat: RepoStat;
  sanitizedConfig: SanitizedConfig | Record<string, never>;
  unifiedProjects: UnifiedProject[];
  theme: string;
  setTheme: (theme: string) => void;
}

export const Header = ({
  repositoryOwner,
  portfolioRepository,
  profile,
  repositoryUrl,
  repositoriesUrl,
  issuesUrl,
  starsUrl,
  repoStat,
  sanitizedConfig,
  unifiedProjects,
  theme,
  setTheme,
}: HeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [pendingExternalLink, setPendingExternalLink] = useState<{
    href: string;
    label: string;
  } | null>(null);
  const [visibleTabIds, setVisibleTabIds] = useState<string[]>([]);
  const menuRef = useRef<HTMLUListElement | null>(null);
  const tabContainerRef = useRef<HTMLDivElement | null>(null);
  const moreMeasureRef = useRef<HTMLButtonElement | null>(null);
  const tabMeasureRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [showSearch, setShowSearch] = useState<boolean>(false);

  const tabPathMap: Record<AppTab, string> = {
    overview: '/overview',
    insights: '/insights',
    projects: '/projects',
    packages: '/packages',
    issues: '/issues',
  };

  type NavItem = {
    id: string;
    label: string;
    count?: number;
    icon: ReactNode;
    kind: 'internal' | 'external';
    to?: string;
    href?: string;
  };

  const githubUsername = sanitizedConfig.github.username;
  const pullRequestsUrl = portfolioRepository
    ? `${repositoryUrl}/pulls`
    : `https://github.com/pulls`;
  const userProfileUrl = `https://github.com/${githubUsername}`;
  const resolvedAvatarUrl =
    profile?.avatar || `https://github.com/${githubUsername}.png`;

  const tabItems = useMemo<NavItem[]>(
    () => [
      {
        id: 'overview',
        label: 'Overview',
        icon: <BookIcon size={16} />,
        kind: 'internal',
        to: tabPathMap.overview,
      },
      {
        id: 'insights',
        label: 'Insights',
        icon: <ProjectIcon size={16} />,
        kind: 'internal',
        to: tabPathMap.insights,
      },
      {
        id: 'repositories',
        label: 'Repositories',
        count: repoStat.publicNonForkCount,
        icon: <RepoIcon size={16} />,
        kind: 'external',
        href: repositoriesUrl,
      },
      {
        id: 'projects',
        label: 'Projects',
        icon: <ProjectIcon size={16} />,
        kind: 'internal',
        to: tabPathMap.projects,
      },
      {
        id: 'packages',
        label: 'Packages',
        icon: <PackageIcon size={16} />,
        kind: 'internal',
        to: tabPathMap.packages,
      },
      {
        id: 'stars',
        label: 'Stars',
        count: repoStat.totalStars,
        icon: <StarIcon size={16} />,
        kind: 'external',
        href: starsUrl,
      },
      {
        id: 'issues',
        label: 'Issues',
        icon: <IssueOpenedIcon size={16} />,
        kind: 'internal',
        to: tabPathMap.issues,
      },
    ],
    [
      repoStat.publicNonForkCount,
      repoStat.totalStars,
      repositoriesUrl,
      starsUrl,
      tabPathMap.insights,
      tabPathMap.issues,
      tabPathMap.overview,
      tabPathMap.packages,
      tabPathMap.projects,
    ],
  );

  const getTabLabel = (item: NavItem) =>
    typeof item.count === 'number'
      ? `${item.label} (${item.count})`
      : item.label;

  const openExternalLink = (href: string, label: string) => {
    setPendingExternalLink({ href, label });
    if (menuRef.current) {
      (document.activeElement as HTMLElement)?.blur();
    }
  };

  const closeExternalLinkDialog = () => {
    setPendingExternalLink(null);
  };

  const proceedExternalLink = () => {
    if (!pendingExternalLink) {
      return;
    }

    window.open(pendingExternalLink.href, '_blank', 'noopener,noreferrer');
    closeExternalLinkDialog();
  };

  const handleTabClick = (item: NavItem) => {
    if (menuRef.current) {
      (document.activeElement as HTMLElement)?.blur();
    }

    if (item.kind === 'internal' && item.to) {
      router.push(item.to);
      return;
    }

    if (item.kind === 'external' && item.href) {
      openExternalLink(item.href, item.label);
    }
  };

  const isActiveItem = (item: NavItem) =>
    item.kind === 'internal' && item.to === pathname;

  useEffect(() => {
    const recalculateVisibleTabs = () => {
      const containerWidth = tabContainerRef.current?.offsetWidth ?? 0;

      if (!containerWidth) {
        setVisibleTabIds(tabItems.map((item) => item.id));
        return;
      }

      const measuredWidths = tabItems.map((item) => {
        const node = tabMeasureRefs.current[item.id];
        return node ? node.offsetWidth : 0;
      });

      if (measuredWidths.some((width) => width === 0)) {
        setVisibleTabIds(tabItems.map((item) => item.id));
        return;
      }

      const totalTabsWidth = measuredWidths.reduce(
        (acc, width) => acc + width,
        0,
      );

      if (totalTabsWidth <= containerWidth) {
        setVisibleTabIds(tabItems.map((item) => item.id));
        return;
      }

      const moreWidth = moreMeasureRef.current?.offsetWidth ?? 86;
      const availableWidth = Math.max(0, containerWidth - moreWidth);
      const nextVisibleIds: string[] = [];
      let usedWidth = 0;

      for (let index = 0; index < tabItems.length; index += 1) {
        const item = tabItems[index];
        const width = measuredWidths[index];

        if (usedWidth + width > availableWidth) {
          break;
        }

        nextVisibleIds.push(item.id);
        usedWidth += width;
      }

      setVisibleTabIds(nextVisibleIds);
    };

    recalculateVisibleTabs();

    const resizeObserver = new ResizeObserver(() => {
      recalculateVisibleTabs();
    });

    if (tabContainerRef.current) {
      resizeObserver.observe(tabContainerRef.current);
    }

    window.addEventListener('resize', recalculateVisibleTabs);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', recalculateVisibleTabs);
    };
  }, [tabItems]);

  const visibleTabs = tabItems.filter((item) =>
    visibleTabIds.includes(item.id),
  );
  const overflowTabs = tabItems.filter(
    (item) => !visibleTabIds.includes(item.id),
  );

  const topActions = [
    {
      id: 'pull-requests',
      label: 'Pull requests',
      icon: <GitPullRequestIcon size={16} />,
      href: pullRequestsUrl,
    },
    {
      id: 'issues',
      label: 'Issues',
      icon: <IssueOpenedIcon size={16} />,
      href: issuesUrl,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <MarkGithubIcon size={16} />,
      href: userProfileUrl,
    },
  ];

  const renderTabButton = (item: NavItem) => (
    <button
      key={item.id}
      type="button"
      className={`tab gap-2 whitespace-nowrap ${isActiveItem(item) ? 'tab-active' : ''}`}
      onClick={() => handleTabClick(item)}
    >
      {item.icon}
      {getTabLabel(item)}
    </button>
  );

  return (
    <>
      <div className="sticky top-0 z-1 max-w-7xl mx-auto px-4 lg:px-8 py-3 bg-base-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Image
            src={resolvedAvatarUrl}
            alt={profile?.name || githubUsername}
            className="size-8 rounded-full ring-1 ring-base-300"
            width={32}
            height={32}
          />
          <div className="min-w-0">
            <div className="font-semibold truncate">
              {profile?.name || githubUsername}
            </div>
            <div className="text-xs opacity-70 truncate">
              {sanitizedConfig.title || 'GitHub Portfolio'}
            </div>
          </div>
          <div className="hidden lg:flex items-center">
            <SearchBar
              sanitizedConfig={sanitizedConfig}
              unifiedProjects={unifiedProjects}
              profile={profile}
              // onNavigate={closeMobileMenu}
            />
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm">
          {topActions.map((action) => (
            <button
              key={action.id}
              type="button"
              className="btn btn-ghost btn-sm gap-2"
              onClick={() => openExternalLink(action.href, action.label)}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
          {!sanitizedConfig.themeConfig.disableSwitch && (
            <select
              className="select select-bordered select-xs cursor-pointer"
              value={theme}
              onChange={(event) => setTheme(event.target.value)}
            >
              <optgroup label="Light Themes">
                {sanitizedConfig.themeConfig.themes.light.map((item) => (
                  <option key={item} value={item}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </option>
                ))}
              </optgroup>

              <optgroup label="Dark Themes">
                {sanitizedConfig.themeConfig.themes.dark.map((item) => (
                  <option key={item} value={item}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </option>
                ))}
              </optgroup>
            </select>
          )}
        </div>
        <div className="flex items-center gap-1 lg:hidden">
          {showSearch ? (
            <div className="fixed z-1 left-0 top-0 w-full justify-center py-3 bg-base-200 md:p-0 md:bg-transparent md:static flex lg:hidden items-center">
              <SearchBar
                sanitizedConfig={sanitizedConfig}
                unifiedProjects={unifiedProjects}
                profile={profile}
                onNavigate={() => setShowSearch(false)}
                onClose={() => setShowSearch(false)}
              />
            </div>
          ) : (
            <button
              className="btn btn-outline btn-xs lg:hidden"
              onClick={() => setShowSearch(true)}
            >
              <SearchIcon size={16} />
            </button>
          )}
          <div className="dropdown dropdown-end md:hidden">
            <button type="button" tabIndex={0} className="btn btn-ghost btn-sm">
              <ThreeBarsIcon size={18} />
            </button>
            <ul
              tabIndex={0}
              ref={menuRef}
              className="menu menu-sm dropdown-content z-1 mt-2 w-72 rounded-box bg-base-100 shadow"
            >
              <li className="menu-title">Navigation</li>
              {tabItems.map((item) => (
                <li key={`mobile-${item.id}`}>
                  <button type="button" onClick={() => handleTabClick(item)}>
                    {item.icon}
                    {getTabLabel(item)}
                    {item.kind === 'external' && <ChevronRightIcon size={14} />}
                  </button>
                </li>
              ))}
              <li className="menu-title mt-2">Actions</li>
              {topActions.map((action) => (
                <li key={`mobile-action-${action.id}`}>
                  <button
                    type="button"
                    onClick={() => openExternalLink(action.href, action.label)}
                  >
                    {action.icon}
                    {action.label}
                    <ChevronRightIcon size={14} />
                  </button>
                </li>
              ))}
              {!sanitizedConfig.themeConfig.disableSwitch && (
                <li className="px-4 py-2">
                  <label className="label px-0 pb-1 pt-0 text-xs">Theme</label>
                  <select
                    className="select select-bordered select-sm w-full cursor-pointer"
                    value={theme}
                    onChange={(event) => setTheme(event.target.value)}
                  >
                    <optgroup label="Light Themes">
                      {sanitizedConfig.themeConfig.themes.light.map((item) => (
                        <option key={item} value={item}>
                          {item.charAt(0).toUpperCase() + item.slice(1)}
                        </option>
                      ))}
                    </optgroup>

                    <optgroup label="Dark Themes">
                      {sanitizedConfig.themeConfig.themes.dark.map((item) => (
                        <option key={item} value={item}>
                          {item.charAt(0).toUpperCase() + item.slice(1)}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <header className="border-b border-base-300 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2">
            <RepoIcon size={16} />
            <button
              type="button"
              onClick={() => openExternalLink(repositoryUrl, 'Repository')}
              className="text-base font-semibold hover:text-primary text-left"
            >
              <span className="opacity-70">{repositoryOwner}</span> /{' '}
              <span>
                {portfolioRepository || sanitizedConfig.github.username}
              </span>
            </button>
            <span className="badge badge-neutral badge-xs">Public</span>
          </div>
          {portfolioRepository && (
            <div className="flex items-center gap-2">
              <iframe
                title="GitHub Star Button"
                src={`https://ghbtns.com/github-btn.html?user=${repositoryOwner}&repo=${portfolioRepository}&type=star&count=true`}
                width="110"
                height="20"
              />
              <iframe
                title="GitHub Fork Button"
                src={`https://ghbtns.com/github-btn.html?user=${repositoryOwner}&repo=${portfolioRepository}&type=fork&count=true`}
                width="110"
                height="20"
              />
            </div>
          )}
        </div>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 hidden md:block">
          <div ref={tabContainerRef} className="tabs tabs-bordered flex-nowrap">
            {visibleTabs.map((item) => renderTabButton(item))}
            {overflowTabs.length > 0 && (
              <div className="dropdown dropdown-end">
                <button
                  type="button"
                  tabIndex={0}
                  className="tab gap-2 whitespace-nowrap"
                >
                  More
                  <ChevronDownIcon size={14} />
                </button>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content z-1 mt-2 w-64 rounded-box bg-base-100 shadow"
                >
                  {overflowTabs.map((item) => (
                    <li key={`overflow-${item.id}`}>
                      <button
                        type="button"
                        onClick={() => handleTabClick(item)}
                      >
                        {item.icon}
                        {getTabLabel(item)}
                        {item.kind === 'external' && (
                          <ChevronRightIcon size={14} />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="absolute left-0 -top-2500 opacity-0 pointer-events-none">
            <div className="tabs tabs-bordered">
              {tabItems.map((item) => (
                <button
                  key={`measure-${item.id}`}
                  type="button"
                  ref={(node) => {
                    tabMeasureRefs.current[item.id] = node;
                  }}
                  className="tab gap-2 whitespace-nowrap"
                >
                  {item.icon}
                  {getTabLabel(item)}
                </button>
              ))}
              <button
                type="button"
                ref={moreMeasureRef}
                className="tab gap-2 whitespace-nowrap"
              >
                More
                <ChevronDownIcon size={14} />
              </button>
            </div>
          </div>
        </div>

        {pendingExternalLink && (
          <dialog className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-semibold text-lg">Leave this portfolio?</h3>
              <p className="py-3 text-sm">
                You are about to open {pendingExternalLink.label} on GitHub in a
                new tab.
              </p>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={closeExternalLinkDialog}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={proceedExternalLink}
                >
                  Proceed
                </button>
              </div>
            </div>
            <button
              type="button"
              className="modal-backdrop"
              onClick={closeExternalLinkDialog}
              aria-label="Close"
            />
          </dialog>
        )}
      </header>
    </>
  );
};
