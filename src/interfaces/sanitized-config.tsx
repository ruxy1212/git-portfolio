export interface SanitizedGithub {
  username: string;
  repositoryOwner: string;
  defaultRepository?: string;
  projectRepository?: string;
}

export interface SanitizedGitHubProjects {
  display: boolean;
  mode: string;
  automatic: {
    sortBy: string;
    limit: number;
    exclude: {
      forks: boolean;
      projects: Array<string>;
    };
  };
  manual: {
    projects: Array<string>;
  };
  explainerApi: {
    url?: string;
    limit: number;
  };
  screenshotApi?: string;
}

export interface SanitizedExternalProject {
  title: string;
  description?: string;
  fullDescription?: string;
  year?: string;
  stack?: string[];
  categories?: string[];
  media?: string[];
  videoUrl?: string;
  link: string;
  repo: string;
}

export interface SanitizedExternalProjects {
  projects: SanitizedExternalProject[];
}

export interface SanitizedProjects {
  lastToFirst: boolean;
  github: SanitizedGitHubProjects;
  external: SanitizedExternalProjects;
}

export interface SanitizedSEO {
  title?: string;
  description?: string;
  imageURL?: string;
}

export interface SanitizedSocial {
  linkedin?: string;
  x?: string;
  mastodon?: string;
  researchGate?: string;
  facebook?: string;
  instagram?: string;
  reddit?: string;
  threads?: string;
  youtube?: string;
  udemy?: string;
  dribbble?: string;
  behance?: string;
  medium?: string;
  dev?: string;
  stackoverflow?: string;
  website?: string;
  telegram?: string;
  phone?: string;
  email?: string;
  discord?: string;
}

export interface SanitizedResume {
  fileUrl?: string;
}

export interface SanitizedExperience {
  company?: string;
  position?: string;
  from: string;
  to: string;
  companyLink?: string;
  description?: string;
}

export interface SanitizedCertification {
  body?: string;
  name?: string;
  year?: string;
  link?: string;
}

export interface SanitizedEducation {
  institution?: string;
  degree?: string;
  from: string;
  to: string;
}

export interface SanitizedPublication {
  title: string;
  conferenceName?: string;
  journalName?: string;
  authors?: string;
  link?: string;
  description?: string;
}

export interface SanitizedGoogleAnalytics {
  id?: string;
}

export interface SanitizedHotjar {
  id?: string;
  snippetVersion: number;
}

export interface SanitizedBlog {
  display: boolean;
  source: string;
  username: string;
  limit: number;
}

export interface SanitizedContact {
  endpoint?: string;
}

export interface SanitizedThemeConfig {
  defaultTheme: string;
  disableSwitch: boolean;
  respectPrefersColorScheme: boolean;
  displayAvatarRing: boolean;
  themes: {
    light: Array<string>;
    dark: Array<string>;
  };
}

export interface SanitizedCacheConfig {
  enabled: boolean;
  ttl: number;
}

export interface SanitizedConfig {
  github: SanitizedGithub;
  title: string;
  projects: SanitizedProjects;
  seo: SanitizedSEO;
  social: SanitizedSocial;
  resume: SanitizedResume;
  skills: Array<string>;
  experiences: Array<SanitizedExperience>;
  educations: Array<SanitizedEducation>;
  certifications: Array<SanitizedCertification>;
  publications: Array<SanitizedPublication>;
  googleAnalytics: SanitizedGoogleAnalytics;
  hotjar: SanitizedHotjar;
  blog: SanitizedBlog;
  contact: SanitizedContact;
  themeConfig: SanitizedThemeConfig;
  cache: SanitizedCacheConfig;
  footer?: string;
  enablePWA: boolean;
}
