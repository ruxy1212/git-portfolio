interface Github {
  /**
   * GitHub org/user name
   */
  username: string;

  /**
   * Repository owner. Defaults to username
   */
  repositoryOwner?: string;

  /**
   * Repository name used for README, stars and issues links
   */
  defaultRepository?: string;
  projectRepository?: string;
}

interface GitHubProjects {
  /**
   * Display GitHub projects?
   */
  display?: boolean;

  /**
   * Header
   */
  header?: string;

  /**
   * 'automatic' | 'manual'
   */
  mode?: string;

  /**
   * Config of automatic mode
   */
  automatic?: {
    /**
     * 'stars' | 'updated'
     */
    sortBy?: string;

    /**
     * How many projects to display
     */
    limit?: number;

    /**
     * Exclude projects option
     */
    exclude?: {
      /**
       * Forked projects will not be displayed if set to true
       */
      forks?: boolean;

      /**
       * These projects will not be displayed
       *
       * example: ['my-project1', 'my-project2']
       */
      projects?: Array<string>;
    };
  };

  /**
   * Config of manual mode
   */
  manual?: {
    /**
     * These projects will be displayed
     *
     * example: ['my-project1', 'my-project2']
     */
    projects?: Array<string>;
  };
  /**
   * API endpoint to explain repositories using AI
   */
  explainerApi: {
    /**
     * The url of the endpoint, where request:
     * POST /api/analyze-repos
        {
          "repos": ["vercel/next.js", "facebook/react", "django/django"],
          "forceRefresh": false
        }
     * And response:
        {
          "results": [
            {
              "repo": "vercel/next.js",
              "summary": "A React framework for building full-stack web applications with SSR and SSG.",
              "technologies": ["React", "TypeScript", "Node.js", "Webpack", "SWC"]
            }
          ],
          "meta": { "total": 3, "fromCache": 1, "freshlyFetched": 2 }
        }
     * limit is the amount of repos to analyze. Keep it at 5 for free tier to avoid max token errors.
     */
    url?: string;
    limit: number;
  };
  /**
   * API endpoint to get repository screenshots. The url should accept a query param with the live link
   */
  screenshotApi?: string;
}

interface ExternalProjects {
  /**
   * Header
   */
  header?: string;

  /**
   * Project list
   */
  projects?: {
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
  }[];
}

interface Projects {
  lastToFirst?: boolean;
  github?: GitHubProjects;
  external?: ExternalProjects;
}

interface SEO {
  /**
   * Meta title
   */
  title?: string;

  /**
   * Meta description
   */
  description?: string;

  /**
   * Meta image
   */
  imageURL?: string;
}

interface Social {
  /**
   * LinkedIn
   */
  linkedin?: string;

  /**
   * X (formerly Twitter)
   */
  x?: string;

  /**
   * Mastodon
   */
  mastodon?: string;

  /**
   * ResearchGate username
   */
  researchGate?: string;

  /**
   * Facebook
   */
  facebook?: string;

  /**
   * Instagram
   */
  instagram?: string;

  /**
   * Reddit
   */
  reddit?: string;

  /**
   * Threads
   */
  threads?: string;

  /**
   * YouTube
   */
  youtube?: string;

  /**
   * Udemy
   */
  udemy?: string;

  /**
   * Dribbble
   */
  dribbble?: string;

  /**
   * Behance
   */
  behance?: string;

  /**
   * Medium
   */
  medium?: string;

  /**
   * dev
   */
  dev?: string;

  /**
   * Stack Overflow
   */
  stackoverflow?: string;

  /**
   * Website
   */
  website?: string;

  /**
   * Telegram username
   */
  telegram?: string;

  /**
   * Phone
   */
  phone?: string;

  /**
   * Email
   */
  email?: string;

  /**
   * Discord username
   */
  discord?: string;
}

interface Resume {
  /**
   * Resume file url
   */
  fileUrl?: string;
}

interface Experience {
  company?: string;
  position?: string;
  from: string;
  to: string;
  companyLink?: string;
  description?: string;
}

interface Certification {
  body?: string;
  name?: string;
  year?: string;
  link?: string;
}

interface Education {
  institution?: string;
  degree?: string;
  from: string;
  to: string;
}

interface Publication {
  title: string;
  conferenceName?: string;
  journalName?: string;
  authors?: string;
  link?: string;
  description?: string;
}

interface GoogleAnalytics {
  /**
   * GA3 tracking id/GA4 tag id UA-XXXXXXXXX-X | G-XXXXXXXXXX
   */
  id?: string;
}

interface Hotjar {
  /**
   * Hotjar id
   */
  id?: string;

  /**
   * Snippet Version
   */
  snippetVersion?: number;
}

interface Blog {
  /**
   * medium | dev
   */
  source?: string;

  /**
   * Username
   */
  username?: string;

  /**
   * How many articles to display
   *
   * Max is 10
   */
  limit?: number;
}

interface Contact {
  /**
   * Contact form endpoint
   */
  endpoint?: string;
}

interface ThemeConfig {
  /**
   * Default theme
   */
  defaultTheme?: string;

  /**
   * Hides the switch in the navbar
   */
  disableSwitch?: boolean;

  /**
   * Should use the prefers-color-scheme media-query
   */
  respectPrefersColorScheme?: boolean;

  /**
   * Hide the ring in Profile picture
   */
  displayAvatarRing?: boolean;

  /**
   * Available themes
   */
  themes?: {
    light: Array<string>;
    dark: Array<string>;
  };
}

interface CacheConfig {
  enabled: boolean;
  ttl: number; // Time to live in milliseconds
}

interface Config {
  /**
   * GitHub config
   */
  github: Github;

  title: string;

  /**
   * Vite's base url
   */
  base?: string;

  /**
   * Projects config
   */
  projects?: Projects;

  /**
   * SEO config
   */
  seo?: SEO;

  /**
   * Social links
   */
  social?: Social;

  /**
   * Skill list
   */
  skills?: Array<string>;

  /**
   * Experience list
   */
  experiences?: Array<Experience>;

  /**
   * Certifications list
   */
  certifications?: Array<Certification>;

  /**
   * Education list
   */
  educations?: Array<Education>;

  /**
   * Publication list
   */
  publications?: Array<Publication>;

  /**
   * Resume
   */
  resume?: Resume;

  /**
   * Google Analytics config
   */
  googleAnalytics?: GoogleAnalytics;

  /**
   * Hotjar config
   */
  hotjar?: Hotjar;

  /**
   * Blog config
   */
  blog?: Blog;

  /**
   * Contact form config
   */
  contact?: Contact;

  /**
   * Theme config
   */
  themeConfig?: ThemeConfig;

  /**
   * Cache configuration
   */
  cache?: CacheConfig;

  /**
   * Custom footer
   */
  footer?: string;

  /**
   * Enable PWA
   */
  enablePWA?: boolean;
}

declare const CONFIG: Config;
