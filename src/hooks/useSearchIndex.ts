import { useMemo } from 'react';
import { SanitizedConfig } from '../interfaces/sanitized-config';
import { Profile } from '../interfaces/profile';
// import { GithubProject } from '../interfaces/github-project';

export type SearchSection = 'overview' | 'projects' | 'insights' | 'packages';

export type SearchResult = {
  section: SearchSection;
  sectionLabel: string;
  sectionPath: string;
  matchedItems: SearchMatch[];
};

export type SearchMatch = {
  label: string;
  sublabel?: string;
  keywords: string[];
};

type UnifiedProject = {
  id: string;
  name: string;
  shortDescription: string;
  stack: string[];
  year: string;
};

type SearchIndexEntry = {
  section: SearchSection;
  sectionLabel: string;
  sectionPath: string;
  match: SearchMatch;
  searchText: string;
};

const normalize = (s: string) => s.toLowerCase().trim();

export function buildSearchIndex(
  sanitizedConfig: SanitizedConfig | Record<string, never>,
  profile: Profile | null,
  unifiedProjects: UnifiedProject[],
): SearchIndexEntry[] {
  const entries: SearchIndexEntry[] = [];

  // ─── OVERVIEW ────────────────────────────────────────────────────────────────

  // Skills
  (sanitizedConfig.skills || []).forEach((skill: string) => {
    entries.push({
      section: 'overview',
      sectionLabel: 'Overview',
      sectionPath: '/overview',
      match: { label: skill, sublabel: 'Skill', keywords: [skill] },
      searchText: normalize(skill),
    });
  });

  // Social links (overview)
  const social = sanitizedConfig.social || {};
  Object.entries(social).forEach(([key, val]) => {
    if (val) {
      entries.push({
        section: 'overview',
        sectionLabel: 'Overview',
        sectionPath: '/overview',
        match: {
          label: key,
          sublabel: String(val),
          keywords: [key, String(val)],
        },
        searchText: normalize(`${key} ${val}`),
      });
    }
  });

  // About / bio text words — index the whole bio
  const bio = profile?.bio || '';
  if (bio) {
    entries.push({
      section: 'overview',
      sectionLabel: 'Overview',
      sectionPath: '/overview',
      match: {
        label: 'Bio',
        sublabel: bio.slice(0, 80) + (bio.length > 80 ? '…' : ''),
        keywords: bio.split(/\s+/),
      },
      searchText: normalize(bio),
    });
  }

  // ─── PROJECTS ────────────────────────────────────────────────────────────────

  unifiedProjects.forEach((project) => {
    const keywords = [
      project.name,
      project.shortDescription,
      ...project.stack,
      project.year,
    ].filter(Boolean);

    entries.push({
      section: 'projects',
      sectionLabel: 'Projects',
      sectionPath: '/projects',
      match: {
        label: project.name,
        sublabel:
          project.shortDescription?.slice(0, 60) +
          (project.shortDescription?.length > 60 ? '…' : ''),
        keywords,
      },
      searchText: normalize(keywords.join(' ')),
    });
  });

  // ─── INSIGHTS (Education, Experience, Certifications) ────────────────────────

  (sanitizedConfig.experiences || []).forEach(
    (exp: {
      company?: string;
      position?: string;
      from?: string;
      to?: string;
      companyLink?: string;
    }) => {
      const label = exp.position || exp.company || 'Experience';
      const sublabel = [
        exp.company,
        exp.from && exp.to ? `${exp.from} – ${exp.to}` : '',
      ]
        .filter(Boolean)
        .join(' · ');
      const keywords = [exp.company, exp.position, exp.from, exp.to].filter(
        Boolean,
      ) as string[];
      entries.push({
        section: 'insights',
        sectionLabel: 'Insights',
        sectionPath: '/insights',
        match: { label, sublabel, keywords },
        searchText: normalize(keywords.join(' ')),
      });
    },
  );

  (sanitizedConfig.educations || []).forEach(
    (edu: {
      institution?: string;
      degree?: string;
      from?: string;
      to?: string;
    }) => {
      const label = edu.institution || 'Education';
      const sublabel = [
        edu.degree,
        edu.from && edu.to ? `${edu.from} – ${edu.to}` : '',
      ]
        .filter(Boolean)
        .join(' · ');
      const keywords = [edu.institution, edu.degree, edu.from, edu.to].filter(
        Boolean,
      ) as string[];
      entries.push({
        section: 'insights',
        sectionLabel: 'Insights',
        sectionPath: '/insights',
        match: { label, sublabel, keywords },
        searchText: normalize(keywords.join(' ')),
      });
    },
  );

  (sanitizedConfig.certifications || []).forEach(
    (cert: { name?: string; body?: string; year?: string }) => {
      const keywords = [cert.name, cert.body, cert.year].filter(
        Boolean,
      ) as string[];
      entries.push({
        section: 'insights',
        sectionLabel: 'Insights',
        sectionPath: '/insights',
        match: {
          label: cert.name || 'Certification',
          sublabel: [cert.body, cert.year].filter(Boolean).join(' · '),
          keywords,
        },
        searchText: normalize(keywords.join(' ')),
      });
    },
  );

  // ─── PACKAGES ────────────────────────────────────────────────────────────────

  (sanitizedConfig.publications || []).forEach(
    (pub: {
      title?: string;
      conferenceName?: string;
      journalName?: string;
      description?: string;
    }) => {
      const keywords = [
        pub.title,
        pub.conferenceName,
        pub.journalName,
        pub.description,
      ].filter(Boolean) as string[];
      entries.push({
        section: 'packages',
        sectionLabel: 'Packages',
        sectionPath: '/packages',
        match: {
          label: pub.title || 'Publication',
          sublabel: pub.conferenceName || pub.journalName || '',
          keywords,
        },
        searchText: normalize(keywords.join(' ')),
      });
    },
  );

  return entries;
}

export function useSearchResults(
  query: string,
  sanitizedConfig: SanitizedConfig | Record<string, never>,
  unifiedProjects: UnifiedProject[],
  profile: Profile | null,
): SearchResult[] {
  const index = useMemo(
    () => buildSearchIndex(sanitizedConfig, profile, unifiedProjects),
    [sanitizedConfig, profile, unifiedProjects],
  );

  return useMemo(() => {
    const q = normalize(query);
    if (!q || q.length < 2) return [];

    const terms = q.split(/\s+/).filter(Boolean);

    const matched = index.filter((entry) =>
      terms.every((term) => entry.searchText.includes(term)),
    );

    // Group by section
    const sectionMap = new Map<SearchSection, SearchResult>();

    matched.forEach((entry) => {
      if (!sectionMap.has(entry.section)) {
        sectionMap.set(entry.section, {
          section: entry.section,
          sectionLabel: entry.sectionLabel,
          sectionPath: entry.sectionPath,
          matchedItems: [],
        });
      }
      const group = sectionMap.get(entry.section)!;
      // Deduplicate by label
      const alreadyExists = group.matchedItems.some(
        (m) => m.label === entry.match.label,
      );
      if (!alreadyExists) {
        group.matchedItems.push(entry.match);
      }
    });

    // Order: overview → projects → insights → packages
    const order: SearchSection[] = [
      'overview',
      'projects',
      'insights',
      'packages',
    ];
    return order
      .map((s) => sectionMap.get(s))
      .filter(Boolean) as SearchResult[];
  }, [query, index]);
}
