'use client';

import {
  type ReactNode,
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import { AxiosError } from 'axios';
import { formatDistance } from 'date-fns';

import {
  type CustomError,
  GENERIC_ERROR,
  INVALID_CONFIG_ERROR,
  INVALID_GITHUB_USERNAME_ERROR,
  setTooManyRequestError,
} from '@/constants/errors';
import { getInitialTheme, getSanitizedConfig, setupHotjar } from '../utils';
import type { SanitizedConfig } from '@/interfaces/sanitized-config';
import type { Profile, GithubProject } from '@/interfaces';
import { fetchAction, postAction } from '@/utils/api';
import {
  AiFillInstagram,
  AiFillMediumSquare,
  AiOutlineGlobal,
} from 'react-icons/ai';
import { CgDribbble } from 'react-icons/cg';
import {
  FaBehanceSquare,
  FaDev,
  FaFacebook,
  FaLinkedin,
  FaMastodon,
  FaReddit,
  FaStackOverflow,
  FaTelegram,
  FaYoutube,
} from 'react-icons/fa';
import { FaSquareThreads } from 'react-icons/fa6';
import { RiDiscordFill, RiMailFill, RiPhoneFill } from 'react-icons/ri';
import { SiResearchgate, SiUdemy, SiX } from 'react-icons/si';
import { LOCAL_STORAGE_KEY_NAME } from '@/constants';

// Types
type RepoStat = {
  publicNonForkCount: number;
  totalStars: number;
};

type UnifiedProject = {
  id: string;
  type: 'github' | 'external';
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

type SocialLinkItem = {
  key: string;
  label: string;
  value: string;
  href: string;
  icon: ReactNode;
};

interface PortfolioContextType {
  sanitizedConfig: SanitizedConfig | Record<string, never>;
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  error: CustomError | null;
  loading: boolean;
  profile: Profile | null;
  readme: string;
  repoStat: RepoStat;
  githubProjects: GithubProject[];
  unifiedProjects: UnifiedProject[];
  socialLinks: SocialLinkItem[];
  repositoryOwner: string;
  portfolioRepository: string | undefined;
  repositoryUrl: string;
  repositoriesUrl: string;
  starsUrl: string;
  issuesUrl: string;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const usePortfolioContext = () => {
  const context = useContext(PortfolioContext);
  if (!context)
    throw new Error(
      'usePortfolioContext must be used inside PortfolioProvider',
    );
  return context;
};

export const PortfolioProvider = ({
  config,
  children,
}: {
  config: Config;
  children: ReactNode;
}) => {
  const [sanitizedConfig] = useState<SanitizedConfig | Record<string, never>>(
    getSanitizedConfig(config),
  );
  const [theme, setTheme] = useState<string>(() =>
    getInitialTheme(sanitizedConfig.themeConfig),
  );
  const [error, setError] = useState<CustomError | null>(() =>
    Object.keys(sanitizedConfig).length === 0 ? INVALID_CONFIG_ERROR : null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [readme, setReadme] = useState<string>('');
  const [repoStat, setRepoStat] = useState<RepoStat>({
    publicNonForkCount: 0,
    totalStars: 0,
  });
  const [githubProjects, setGithubProjects] = useState<GithubProject[]>([]);

  // Take care of all errors
  const handleError = (error: AxiosError | Error): void => {
    console.error('Error:', error);

    if (error instanceof AxiosError) {
      try {
        const reset = formatDistance(
          new Date(error.response?.headers?.['x-ratelimit-reset'] * 1000),
          new Date(),
          { addSuffix: true },
        );

        if (typeof error.response?.status === 'number') {
          switch (error.response.status) {
            case 403:
              setError(setTooManyRequestError(reset));
              break;
            case 404:
              setError(INVALID_GITHUB_USERNAME_ERROR);
              break;
            default:
              setError(GENERIC_ERROR);
              break;
          }
        } else {
          setError(GENERIC_ERROR);
        }
      } catch {
        // (innerError)
        setError(GENERIC_ERROR);
      }
    } else {
      setError(GENERIC_ERROR);
    }
  };

  // All derived URLs and helper functions
  const repositoryOwner = sanitizedConfig.github.username;
  const portfolioRepository = sanitizedConfig.github.portfolioRepository;
  const repositoryUrl = portfolioRepository
    ? `https://github.com/${repositoryOwner}/${portfolioRepository}`
    : `https://github.com/${sanitizedConfig.github.username}`;
  const repositoriesUrl = `https://github.com/${sanitizedConfig.github.username}?tab=repositories`;
  const starsUrl = portfolioRepository
    ? `${repositoryUrl}/stargazers`
    : `https://github.com/${sanitizedConfig.github.username}`;
  const issuesUrl = portfolioRepository
    ? `${repositoryUrl}/issues`
    : `https://github.com/${sanitizedConfig.github.username}?tab=repositories`;

  const getGithubProjects = useCallback(
    async (publicRepoCount: number): Promise<GithubProject[]> => {
      let repoItems: GithubProject[] = [];

      if (sanitizedConfig.projects.github.mode === 'automatic') {
        if (publicRepoCount === 0) {
          return [];
        }

        const excludeRepo =
          sanitizedConfig.projects.github.automatic.exclude.projects
            .map((project) => `+-repo:${project}`)
            .join('');

        const query = `user:${sanitizedConfig.github.username}+fork:${!sanitizedConfig.projects.github.automatic.exclude.forks}${excludeRepo}`;
        const url = `https://api.github.com/search/repositories?q=${query}&sort=${sanitizedConfig.projects.github.automatic.sortBy}&per_page=${sanitizedConfig.projects.github.automatic.limit}&type=Repositories`;

        const repoResponse = await fetchAction(
          url,
          { 'Content-Type': 'application/vnd.github.v3+json' },
          sanitizedConfig.cache,
        );

        repoItems = repoResponse.data.items;
      } else {
        if (sanitizedConfig.projects.github.manual.projects.length === 0) {
          return [];
        }
        const repos = sanitizedConfig.projects.github.manual.projects
          .map((project) => `+repo:${project}`)
          .join('');

        const url = `https://api.github.com/search/repositories?q=${repos}+fork:true&type=Repositories`;

        const repoResponse = await fetchAction(
          url,
          { 'Content-Type': 'application/vnd.github.v3+json' },
          sanitizedConfig.cache,
        );

        repoItems = repoResponse.data.items;
      }

      if (
        sanitizedConfig.projects.github.explainerApi.url &&
        sanitizedConfig.projects.github.explainerApi.limit &&
        repoItems.length > 0
      ) {
        try {
          const limit = sanitizedConfig.projects.github.explainerApi.limit || 5;
          const fullNames = repoItems
            .slice(0, limit)
            .map((item) => item.full_name);

          const explainerResponse = await postAction(
            sanitizedConfig.projects.github.explainerApi.url,
            { repos: fullNames, forceRefresh: false },
            { 'Content-Type': 'application/json' },
          );

          const results: Array<{
            repo: string;
            summary: string;
            technologies: string[];
            categories: string[];
            error?: string;
          }> = explainerResponse.data?.results;

          if (Array.isArray(results) && results.length > 0) {
            const enrichmentMap = new Map(
              results
                .filter((r) => !r.error)
                .map((r) => [
                  r.repo,
                  {
                    summary: r.summary,
                    technologies: r.technologies,
                    categories: r.categories,
                  },
                ]),
            );

            return repoItems.map((item) => {
              const enrichment = enrichmentMap.get(item.full_name);
              if (!enrichment) return item;

              return {
                ...item,
                ext_summary: enrichment?.summary,
                ext_stack: enrichment?.technologies,
                ext_categories: enrichment?.categories,
              };
            });
          }
        } catch {
          // Explainer API failed — return plain repo data below
        }
      }

      return repoItems;
    },
    [
      sanitizedConfig.cache,
      sanitizedConfig.github.username,
      sanitizedConfig.projects.github.mode,
      sanitizedConfig.projects.github.explainerApi,
      sanitizedConfig.projects.github.manual.projects,
      sanitizedConfig.projects.github.automatic.sortBy,
      sanitizedConfig.projects.github.automatic.limit,
      sanitizedConfig.projects.github.automatic.exclude.forks,
      sanitizedConfig.projects.github.automatic.exclude.projects,
    ],
  );

  const getAllUserRepos = useCallback(async (): Promise<GithubProject[]> => {
    const allRepos: GithubProject[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const { data } = await fetchAction(
        `https://api.github.com/users/${sanitizedConfig.github.username}/repos?per_page=100&page=${page}`,
        { 'Content-Type': 'application/vnd.github.v3+json' },
        sanitizedConfig.cache,
      );

      allRepos.push(...data);

      if (data.length < 100) {
        hasMore = false;
      } else {
        page += 1;
      }
    }

    return allRepos;
  }, [sanitizedConfig.github.username, sanitizedConfig.cache]);

  const getReadme = useCallback(async () => {
    if (!portfolioRepository) {
      return '# README\n\nConfigure `github.defaultRepository` to load repository README.';
    }

    try {
      const { data } = await fetchAction(
        `https://api.github.com/repos/${repositoryOwner}/${portfolioRepository}/readme?format=html`,
        { Accept: 'application/vnd.github.html' },
        sanitizedConfig.cache,
      );

      setReadme(data || 'No README found.');
    } catch {
      setReadme('');
    }
  }, [portfolioRepository, repositoryOwner, sanitizedConfig.cache]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetchAction(
        `https://api.github.com/users/${sanitizedConfig.github.username}`,
        {},
        sanitizedConfig.cache,
      );

      const data = response.data;

      setProfile({
        avatar: data.avatar_url,
        name: data.name || ' ',
        bio: data.bio || '',
        location: data.location || '',
        company: data.company || '',
      });

      const [repos, autoGithubProjects] = await Promise.all([
        getAllUserRepos(),
        sanitizedConfig.projects.github.display
          ? getGithubProjects(data.public_repos)
          : Promise.resolve([]),
      ]);

      const nonForkRepos = repos.filter(
        (repo) => !(repo as { fork?: boolean }).fork,
      );
      const totalStars = nonForkRepos.reduce(
        (sum, repo) => sum + Number(repo.stargazers_count || 0),
        0,
      );

      setRepoStat({
        publicNonForkCount: data.public_repos,
        totalStars,
      });
      setGithubProjects(autoGithubProjects);
    } catch (error) {
      handleError(error as AxiosError | Error);
    } finally {
      setLoading(false);
    }
  }, [
    sanitizedConfig.cache,
    sanitizedConfig.github.username,
    getAllUserRepos,
    getGithubProjects,
    sanitizedConfig.projects.github.display,
  ]);

  useEffect(() => {
    if (theme) document.documentElement.setAttribute('data-theme', theme);
    if (theme && typeof window !== 'undefined')
      localStorage.setItem(LOCAL_STORAGE_KEY_NAME, theme);
  }, [theme]);

  const socialLinks = useMemo<SocialLinkItem[]>(() => {
    const links: SocialLinkItem[] = [];
    const social = sanitizedConfig.social;

    const normalize = (value?: string) => value?.trim() || '';
    const isHttpUrl = (value: string) => /^https?:\/\//i.test(value);
    const ensureHttp = (value: string) =>
      isHttpUrl(value) ? value : `https://${value}`;
    const buildHandleHref = (base: string, rawValue: string) =>
      isHttpUrl(rawValue) ? rawValue : `${base}${rawValue}`;

    const addLink = (
      key: string,
      label: string,
      rawValue: string | undefined,
      hrefBuilder: (value: string) => string,
      icon: ReactNode,
      valueFormatter?: (value: string) => string,
    ) => {
      const value = normalize(rawValue);
      if (!value) return;

      links.push({
        key,
        label,
        value: valueFormatter ? valueFormatter(value) : value,
        href: hrefBuilder(value),
        icon,
      });
    };

    addLink(
      'website',
      'Website',
      social.website,
      ensureHttp,
      <AiOutlineGlobal />,
      (value) => value.replace(/^https?:\/\//i, ''),
    );
    addLink(
      'linkedin',
      'LinkedIn',
      social.linkedin,
      (value) => buildHandleHref('https://www.linkedin.com/in/', value),
      <FaLinkedin />,
    );
    addLink(
      'x',
      'X',
      social.x,
      (value) => buildHandleHref('https://x.com/', value),
      <SiX />,
      (value) => value.replace(/^@/, ''),
    );

    addLink(
      'mastodon',
      'Mastodon',
      social.mastodon,
      (value) => {
        const normalizedValue = value.replace(/^@/, '');
        const parts = normalizedValue.split('@');
        if (parts.length < 2 || !parts[0] || !parts[1]) {
          return ensureHttp(value);
        }

        return `https://${parts[1]}/@${parts[0]}`;
      },
      <FaMastodon />,
      (value) => value.replace(/^@/, ''),
    );
    addLink(
      'researchGate',
      'ResearchGate',
      social.researchGate,
      (value) =>
        buildHandleHref('https://www.researchgate.net/profile/', value),
      <SiResearchgate />,
    );
    addLink(
      'facebook',
      'Facebook',
      social.facebook,
      (value) => buildHandleHref('https://www.facebook.com/', value),
      <FaFacebook />,
    );
    addLink(
      'instagram',
      'Instagram',
      social.instagram,
      (value) => buildHandleHref('https://www.instagram.com/', value),
      <AiFillInstagram />,
    );
    addLink(
      'reddit',
      'Reddit',
      social.reddit,
      (value) => buildHandleHref('https://www.reddit.com/user/', value),
      <FaReddit />,
    );
    addLink(
      'threads',
      'Threads',
      social.threads,
      (value) =>
        buildHandleHref('https://www.threads.net/@', value.replace(/^@/, '')),
      <FaSquareThreads />,
      (value) => value.replace(/^@/, ''),
    );
    addLink(
      'youtube',
      'YouTube',
      social.youtube,
      (value) =>
        buildHandleHref('https://www.youtube.com/@', value.replace(/^@/, '')),
      <FaYoutube />,
      (value) => `@${value.replace(/^@/, '')}`,
    );
    addLink(
      'udemy',
      'Udemy',
      social.udemy,
      (value) => buildHandleHref('https://www.udemy.com/user/', value),
      <SiUdemy />,
    );
    addLink(
      'dribbble',
      'Dribbble',
      social.dribbble,
      (value) => buildHandleHref('https://dribbble.com/', value),
      <CgDribbble />,
    );
    addLink(
      'behance',
      'Behance',
      social.behance,
      (value) => buildHandleHref('https://www.behance.net/', value),
      <FaBehanceSquare />,
    );
    addLink(
      'medium',
      'Medium',
      social.medium,
      (value) => {
        if (isHttpUrl(value)) {
          return value;
        }

        return `https://medium.com/@${value.replace(/^@/, '')}`;
      },
      <AiFillMediumSquare />,
      (value) => value.replace(/^@/, ''),
    );
    addLink(
      'dev',
      'Dev',
      social.dev,
      (value) => buildHandleHref('https://dev.to/', value),
      <FaDev />,
    );
    addLink(
      'stackoverflow',
      'Stack Overflow',
      social.stackoverflow,
      (value) => buildHandleHref('https://stackoverflow.com/users/', value),
      <FaStackOverflow />,
      (value) => value.split('/').pop() || value,
    );
    addLink(
      'telegram',
      'Telegram',
      social.telegram,
      (value) => buildHandleHref('https://t.me/', value),
      <FaTelegram />,
    );
    addLink(
      'phone',
      'Phone',
      social.phone,
      (value) => `tel:${value}`,
      <RiPhoneFill />,
    );
    addLink(
      'email',
      'Email',
      social.email,
      (value) => `mailto:${value}`,
      <RiMailFill />,
    );
    addLink(
      'discord',
      'Discord',
      social.discord,
      () => 'https://discord.com/app',
      <RiDiscordFill />,
    );

    return links;
  }, [sanitizedConfig.social]);

  const unifiedProjects = useMemo<UnifiedProject[]>(() => {
    const githubItems = githubProjects.map((project, i) => {
      const year = (project.pushed_at || project.created_at || '').slice(0, 4);
      return {
        id: `github-${i}`,
        type: 'github' as const,
        name: project.name,
        shortDescription:
          project.ext_summary ||
          project.description ||
          'No description available.',
        fullDescription:
          project.ext_summary ||
          project.description ||
          'No description available.',
        year: year || 'N/A',
        stack: project.ext_stack?.length
          ? project.ext_stack
          : project.language
            ? [project.language]
            : [],
        categories: project.ext_categories?.length
          ? project.ext_categories
          : [],
        media: [],
        video: '',
        link: project.homepage || '',
        repo: project.html_url,
      };
    });

    const externalItems = sanitizedConfig.projects.external.projects.map(
      (project, i) => ({
        id: `external-${i}`,
        type: 'external' as const,
        name: project.title,
        shortDescription: project.description || 'No description available.',
        fullDescription: project.fullDescription || project.description || '',
        year: project.year || 'N/A',
        stack: project.stack || [],
        categories: project.categories || [],
        media: project.media && project.media.length ? project.media : [],
        video: project.videoUrl,
        link: project.link,
        repo: project.repo,
      }),
    );

    return [...githubItems, ...externalItems];
  }, [githubProjects, sanitizedConfig.projects.external.projects]);

  const contextValue = useMemo(
    () => ({
      sanitizedConfig,
      theme,
      setTheme,
      error,
      loading,
      profile,
      readme,
      repoStat,
      githubProjects,
      unifiedProjects,
      socialLinks,
      repositoryOwner,
      portfolioRepository,
      repositoryUrl,
      repositoriesUrl,
      starsUrl,
      issuesUrl,
    }),
    [
      sanitizedConfig,
      theme,
      error,
      loading,
      profile,
      readme,
      repoStat,
      githubProjects,
      unifiedProjects,
      socialLinks,
      repositoryOwner,
      portfolioRepository,
      repositoryUrl,
      repositoriesUrl,
      starsUrl,
      issuesUrl,
    ],
  );

  useEffect(() => {
    if (Object.keys(sanitizedConfig).length === 0) {
      return;
    }

    setupHotjar(sanitizedConfig.hotjar);

    const load = async () => {
      await Promise.allSettled([loadData(), getReadme()]);
    };

    load();
  }, [sanitizedConfig, loadData, getReadme]);

  return (
    <PortfolioContext.Provider value={contextValue}>
      {children}
    </PortfolioContext.Provider>
  );
};
