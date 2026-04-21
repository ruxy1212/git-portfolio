import { graphql } from '@octokit/graphql';
import { GoogleGenAI } from '@google/genai';

export interface RepoInput {
  owner: string;
  name: string;
}

interface FileNode {
  name: string;
  type: 'blob' | 'tree';
}

export interface RepoData {
  nameWithOwner: string;
  description: string | null;
  primaryLanguage: { name: string } | null;
  languages: { nodes: { name: string }[] };
  repositoryTopics: { nodes: { topic: { name: string } }[] };
  defaultBranchRef: {
    target: {
      history: {
        nodes: {
          message: string;
          committedDate: string;
        }[];
      };
    };
  } | null;
  object: {
    entries: FileNode[];
  } | null;
  packageJson: { text: string } | null;
  composerJson: { text: string } | null;
  requirementsTxt: { text: string } | null;
  cargoToml: { text: string } | null;
  gemfile: { text: string } | null;
  goMod: { text: string } | null;
  readme: { text: string } | null;
}

interface GraphQLResponse {
  [alias: string]: RepoData | null;
}

export interface RepoSummary {
  repo: string;
  summary: string;
  technologies: string[];
  error?: string;
}

const CACHE_TTL_MS = 60 * 60 * 1000;
const CACHE_MAX_SIZE = 200;

interface CacheEntry {
  value: RepoSummary;
  expiresAt: number;
}

class LRUCache {
  private map = new Map<string, CacheEntry>();

  get(key: string): RepoSummary | null {
    const entry = this.map.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.map.delete(key);
      return null;
    }
    this.map.delete(key);
    this.map.set(key, entry);
    return entry.value;
  }

  set(key: string, value: RepoSummary): void {
    if (this.map.size >= CACHE_MAX_SIZE) {
      const firstKey = this.map.keys().next().value;
      if (firstKey) this.map.delete(firstKey);
    }
    this.map.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
  }
}

export const repoCache = new LRUCache();

type GraphQLClient = <T>(
  query: string,
  parameters?: Record<string, unknown>,
) => Promise<T>;

export function parseRepos(rawList: string[]): RepoInput[] {
  return rawList.map((r) => {
    const parts = r.trim().split('/');
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      throw new Error(`Invalid repo format: "${r}". Expected "owner/repo".`);
    }
    return { owner: parts[0], name: parts[1] };
  });
}

function repoAlias(owner: string, name: string, idx: number): string {
  return `repo_${idx}_${owner.replace(/[^a-zA-Z0-9]/g, '_')}_${name.replace(/[^a-zA-Z0-9]/g, '_')}`;
}

function buildBatchQuery(repos: RepoInput[]): string {
  const fragments = repos.map((repo, idx) => {
    const alias = repoAlias(repo.owner, repo.name, idx);
    return `
      ${alias}: repository(owner: "${repo.owner}", name: "${repo.name}") {
        nameWithOwner
        description
        primaryLanguage { name }
        languages(first: 20) { nodes { name } }
        repositoryTopics(first: 20) { nodes { topic { name } } }
        defaultBranchRef {
          target {
            ... on Commit {
              history(first: 10) {
                nodes { message committedDate }
              }
            }
          }
        }
        object(expression: "HEAD:") {
          ... on Tree {
            entries { name type }
          }
        }
        packageJson:    object(expression: "HEAD:package.json")     { ... on Blob { text } }
        composerJson:   object(expression: "HEAD:composer.json")    { ... on Blob { text } }
        requirementsTxt:object(expression: "HEAD:requirements.txt") { ... on Blob { text } }
        cargoToml:      object(expression: "HEAD:Cargo.toml")       { ... on Blob { text } }
        gemfile:        object(expression: "HEAD:Gemfile")          { ... on Blob { text } }
        goMod:          object(expression: "HEAD:go.mod")           { ... on Blob { text } }
        readme:         object(expression: "HEAD:README.md")        { ... on Blob { text } }
      }
    `;
  });

  return `{ ${fragments.join('\n')} }`;
}

export function serializeRepoForPrompt(data: RepoData): string {
  const lines: string[] = [];

  lines.push(`## ${data.nameWithOwner}`);
  if (data.description) lines.push(`Description: ${data.description}`);

  const langs = data.languages.nodes.map((l) => l.name).join(', ');
  if (langs) lines.push(`Languages: ${langs}`);

  const topics = data.repositoryTopics.nodes
    .map((t) => t.topic.name)
    .join(', ');
  if (topics) lines.push(`Topics: ${topics}`);

  if (data.object?.entries?.length) {
    const rootEntries = data.object.entries
      .slice(0, 30)
      .map((entry) => (entry.type === 'tree' ? `${entry.name}/` : entry.name))
      .join(', ');
    lines.push(`Root: ${rootEntries}`);
  }

  const deps: string[] = [];

  if (data.packageJson?.text) {
    try {
      const pkg = JSON.parse(data.packageJson.text);
      const pkgDeps = [
        ...Object.keys(pkg.dependencies ?? {}),
        ...Object.keys(pkg.devDependencies ?? {}),
      ].slice(0, 40);
      deps.push(`npm: ${pkgDeps.join(', ')}`);
    } catch {
      // skip invalid JSON
    }
  }

  if (data.composerJson?.text) {
    try {
      const pkg = JSON.parse(data.composerJson.text);
      const pkgDeps = Object.keys({
        ...(pkg.require ?? {}),
        ...(pkg['require-dev'] ?? {}),
      }).slice(0, 40);
      deps.push(`composer: ${pkgDeps.join(', ')}`);
    } catch {
      // skip invalid JSON
    }
  }

  if (data.requirementsTxt?.text) {
    const reqs = data.requirementsTxt.text
      .split('\n')
      .filter((line) => line && !line.startsWith('#'))
      .slice(0, 40)
      .join(', ');
    deps.push(`pip: ${reqs}`);
  }

  if (data.cargoToml?.text) {
    const match = data.cargoToml.text.match(/\[dependencies\]([\s\S]*?)(\[|$)/);
    if (match) {
      const crates = match[1]
        .split('\n')
        .filter((line) => line.includes('='))
        .map((line) => line.split('=')[0].trim())
        .slice(0, 40)
        .join(', ');
      deps.push(`cargo: ${crates}`);
    }
  }

  if (data.gemfile?.text) {
    const gems = data.gemfile.text
      .split('\n')
      .filter((line) => line.startsWith('gem '))
      .map((line) => line.split('"')[1] ?? line.split("'")[1] ?? '')
      .filter(Boolean)
      .slice(0, 40)
      .join(', ');
    deps.push(`gems: ${gems}`);
  }

  if (data.goMod?.text) {
    const mods = data.goMod.text
      .split('\n')
      .filter((line) => line.startsWith('\t') || line.startsWith('require '))
      .map((line) => line.trim().split(' ')[0])
      .filter((line) => line && !line.startsWith('//'))
      .slice(0, 40)
      .join(', ');
    deps.push(`go modules: ${mods}`);
  }

  if (deps.length) lines.push(`Dependencies — ${deps.join(' | ')}`);

  if (data.readme?.text) {
    const readmeSnippet = data.readme.text
      .replace(/```[\s\S]*?```/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
      .slice(0, 800);
    lines.push(`README (excerpt): ${readmeSnippet}`);
  }

  const commits =
    data.defaultBranchRef?.target?.history?.nodes
      ?.slice(0, 5)
      .map((commit) => `• ${commit.message.split('\n')[0]}`)
      .join('\n') ?? '';

  if (commits) lines.push(`Recent commits:\n${commits}`);

  return lines.join('\n');
}

function buildGeminiPrompt(serializedRepos: string[]): string {
  return `You are a senior software engineer. For each repository below, produce:
1. A one-sentence summary (≤ 25 words) describing what the project does.
2. A compact, deduplicated list of the main technologies used (frameworks, languages, databases, services, tooling).

Return ONLY valid JSON — no markdown fences, no extra text — in this exact shape:
[
  {
    "repo": "owner/name",
    "summary": "...",
    "technologies": ["Tech1", "Tech2"]
  }
]

Repositories:
${serializedRepos.join('\n\n---\n\n')}`;
}

export async function fetchReposFromGitHub(
  repos: RepoInput[],
): Promise<Map<string, RepoData | Error>> {
  const ghToken = process.env.GITHUB_TOKEN;
  if (!ghToken) throw new Error('GITHUB_TOKEN environment variable is not set');

  const graphqlWithAuth = graphql.defaults({
    headers: { authorization: `token ${ghToken}` },
  }) as GraphQLClient;

  const query = buildBatchQuery(repos);

  let rawResult: GraphQLResponse;
  try {
    rawResult = await graphqlWithAuth<GraphQLResponse>(query);
  } catch (err: unknown) {
    console.warn(
      '[github] Batch query failed, falling back to per-repo mode',
      err,
    );
    return fetchReposFallback(repos, graphqlWithAuth);
  }

  const result = new Map<string, RepoData | Error>();
  repos.forEach((repo, idx) => {
    const alias = repoAlias(repo.owner, repo.name, idx);
    const data = rawResult[alias];
    if (data) {
      result.set(`${repo.owner}/${repo.name}`, data);
    } else {
      result.set(
        `${repo.owner}/${repo.name}`,
        new Error('Repository not found or access denied'),
      );
    }
  });

  return result;
}

async function fetchReposFallback(
  repos: RepoInput[],
  gql: GraphQLClient,
): Promise<Map<string, RepoData | Error>> {
  const result = new Map<string, RepoData | Error>();

  for (const repo of repos) {
    const key = `${repo.owner}/${repo.name}`;
    const singleQuery = `{ ${repoAlias(repo.owner, repo.name, 0)}: repository(owner: "${repo.owner}", name: "${repo.name}") {
      nameWithOwner description
      primaryLanguage { name }
      languages(first: 20) { nodes { name } }
      repositoryTopics(first: 20) { nodes { topic { name } } }
      defaultBranchRef { target { ... on Commit { history(first: 10) { nodes { message committedDate } } } } }
      object(expression: "HEAD:") { ... on Tree { entries { name type } } }
      packageJson: object(expression: "HEAD:package.json") { ... on Blob { text } }
      composerJson: object(expression: "HEAD:composer.json") { ... on Blob { text } }
      requirementsTxt: object(expression: "HEAD:requirements.txt") { ... on Blob { text } }
      cargoToml: object(expression: "HEAD:Cargo.toml") { ... on Blob { text } }
      gemfile: object(expression: "HEAD:Gemfile") { ... on Blob { text } }
      goMod: object(expression: "HEAD:go.mod") { ... on Blob { text } }
      readme: object(expression: "HEAD:README.md") { ... on Blob { text } }
    } }`;

    let attempts = 0;
    while (attempts < 3) {
      try {
        const response = await gql<GraphQLResponse>(singleQuery);
        const data = response[repoAlias(repo.owner, repo.name, 0)];
        result.set(key, data ?? new Error('Not found'));
        break;
      } catch (err: unknown) {
        attempts += 1;
        if (attempts >= 3) {
          result.set(key, err instanceof Error ? err : new Error(String(err)));
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
        }
      }
    }
  }

  return result;
}

export async function analyzeWithGemini(
  serializedRepos: string[],
  repoKeys: string[],
): Promise<RepoSummary[]> {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey)
    throw new Error('GEMINI_API_KEY environment variable is not set');

  const prompt = buildGeminiPrompt(serializedRepos);

  const ai = new GoogleGenAI({ apiKey: geminiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      temperature: 0.2,
      maxOutputTokens: 2048,
    },
  });

  const raw = response.text ?? '';

  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();

  let parsed: RepoSummary[];
  try {
    parsed = JSON.parse(cleaned) as RepoSummary[];
  } catch {
    console.error('[gemini] JSON parse error', cleaned.slice(0, 200));
    return repoKeys.map((repo) => ({
      repo,
      summary: 'Failed to parse Gemini response.',
      technologies: [],
      error: 'JSON parse error',
    }));
  }

  const byRepo = new Map(parsed.map((result) => [result.repo, result]));
  return repoKeys.map(
    (key) =>
      byRepo.get(key) ?? {
        repo: key,
        summary: 'No summary returned by AI.',
        technologies: [],
      },
  );
}
