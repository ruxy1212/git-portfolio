export interface Article {
  title: string;
  thumbnail: string;
  link: string;
  publishedAt: Date;
  description: string;
  categories: string[];
}

export interface GithubProject {
  name: string;
  full_name: string;
  homepage?: string;
  html_url: string;
  description?: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at?: string;
  pushed_at?: string;
  created_at?: string;
  ext_summary?: string;
  ext_stack?: string[];
  ext_categories?: string[];
}

export interface Profile {
  avatar: string;
  name: string;
  bio?: string;
  location?: string;
  company?: string;
}
