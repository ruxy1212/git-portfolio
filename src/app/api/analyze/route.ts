import { type NextRequest, NextResponse } from 'next/server';
import {
  analyzeWithGemini,
  fetchReposFromGitHub,
  parseRepos,
  repoCache,
  serializeRepoForPrompt,
  type RepoData,
  type RepoInput,
  type RepoSummary,
} from '@/utils/backend/analyze';

export async function POST(req: NextRequest) {
  let body: { repos?: unknown; forceRefresh?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!Array.isArray(body.repos) || body.repos.length === 0) {
    return NextResponse.json(
      { error: '`repos` must be a non-empty array of "owner/repo" strings.' },
      { status: 400 },
    );
  }
  if (body.repos.length > 20) {
    return NextResponse.json(
      { error: 'Maximum 20 repositories per request.' },
      { status: 400 },
    );
  }

  const forceRefresh = body.forceRefresh === true;

  let parsedRepos: RepoInput[];
  try {
    parsedRepos = parseRepos(body.repos as string[]);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 },
    );
  }

  const cached: RepoSummary[] = [];
  const toFetch: RepoInput[] = [];

  if (!forceRefresh) {
    for (const repo of parsedRepos) {
      const key = `${repo.owner}/${repo.name}`;
      const hit = repoCache.get(key);
      if (hit) {
        cached.push(hit);
      } else {
        toFetch.push(repo);
      }
    }
  } else {
    toFetch.push(...parsedRepos);
  }

  if (toFetch.length === 0) {
    return NextResponse.json({ results: cached, source: 'cache' });
  }

  let githubResults: Map<string, RepoData | Error>;
  try {
    githubResults = await fetchReposFromGitHub(toFetch);
  } catch (err) {
    return NextResponse.json(
      { error: `GitHub fetch failed: ${(err as Error).message}` },
      { status: 502 },
    );
  }

  // Separate successful data from errors
  const successData: { key: string; serialized: string }[] = [];
  const errorResults: RepoSummary[] = [];

  for (const repo of toFetch) {
    const key = `${repo.owner}/${repo.name}`;
    const result = githubResults.get(key);
    if (result instanceof Error) {
      errorResults.push({
        repo: key,
        summary: 'Could not fetch repository data.',
        technologies: [],
        error: result.message,
      });
    } else if (result) {
      successData.push({ key, serialized: serializeRepoForPrompt(result) });
    }
  }

  let geminiResults: RepoSummary[] = [];
  if (successData.length > 0) {
    try {
      geminiResults = await analyzeWithGemini(
        successData.map((d) => d.serialized),
        successData.map((d) => d.key),
      );
    } catch (err) {
      console.error('[gemini] Error', err);
      geminiResults = successData.map(({ key }) => ({
        repo: key,
        summary: 'AI analysis unavailable.',
        technologies: [],
        error: (err as Error).message,
      }));
    }
  }

  for (const result of geminiResults) {
    if (!result.error) {
      repoCache.set(result.repo, result);
    }
  }

  const allNew = [...geminiResults, ...errorResults];
  const allNewByKey = new Map(allNew.map((r) => [r.repo, r]));

  const ordered = parsedRepos.map((repo) => {
    const key = `${repo.owner}/${repo.name}`;
    return (
      allNewByKey.get(key) ??
      cached.find((c) => c.repo === key) ?? {
        repo: key,
        summary: 'Unknown error.',
        technologies: [],
        error: 'Not processed',
      }
    );
  });

  return NextResponse.json({
    results: ordered,
    meta: {
      total: ordered.length,
      fromCache: cached.length,
      freshlyFetched: toFetch.length,
    },
  });
}
