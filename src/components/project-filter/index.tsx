// CategoryFilter.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PROJECT_CATEGORIES } from '../../data/project-categories';
import { HistoryIcon } from '@primer/octicons-react';
import { createPortal } from 'react-dom';

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

interface ProjectFilterProps {
  projects: UnifiedProject[];
}

export default function ProjectFilter({ projects }: ProjectFilterProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSlug = searchParams.get('category') ?? 'all';

  // Slugs that have at least one matching project
  const activeSlugs = useMemo(() => {
    return new Set(
      projects.flatMap((p) =>
        Array.isArray(p.categories) && p.categories.length > 0
          ? p.categories
          : [],
      ),
    );
  }, [projects]);

  // Whether any project is uncategorized
  const hasUncategorized = useMemo(() => {
    return projects.some(
      (p) => !Array.isArray(p.categories) || p.categories.length === 0,
    );
  }, [projects]);

  // Build the options list: only categories that have at least one project
  const visibleCategories = useMemo(() => {
    return PROJECT_CATEGORIES.filter((cat) => activeSlugs.has(cat.slug));
  }, [activeSlugs]);

  // All valid slugs for validation
  const validSlugs = useMemo(() => {
    const slugs = new Set(visibleCategories.map((c) => c.slug));
    if (hasUncategorized) slugs.add('uncategorized');
    return slugs;
  }, [visibleCategories, hasUncategorized]);

  // Revert to 'all' if the slug in the URL is invalid
  useEffect(() => {
    if (currentSlug !== 'all' && !validSlugs.has(currentSlug)) {
      setSearchParams((prev) => {
        prev.delete('category');
        return prev;
      });
    }
  }, [currentSlug, validSlugs, setSearchParams]);

  const selectedLabel = useMemo(() => {
    if (currentSlug === 'all') return 'All Projects';
    if (currentSlug === 'uncategorized') return 'Uncategorized';
    return (
      visibleCategories.find((c) => c.slug === currentSlug)?.name ??
      'All Projects'
    );
  }, [currentSlug, visibleCategories]);

  const handleSelect = (slug: string) => {
    closeDropdown();
    setSearchParams((prev) => {
      if (slug === 'all') {
        prev.delete('category');
      } else {
        prev.set('category', slug);
      }
      return prev;
    });
  };

  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const menuPos = useRef({ top: 0, left: 0 });
  const [isOpen, setIsOpen] = useState(false);

  const closeDropdown = () => {
    detailsRef.current?.removeAttribute('open');
  };

  // Add this useEffect for outside click + escape:
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        detailsRef.current &&
        !detailsRef.current.contains(e.target as Node)
      ) {
        closeDropdown();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDropdown();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <details
      ref={detailsRef}
      className="dropdown"
      onToggle={(e) => {
        const open = (e.target as HTMLDetailsElement).open;
        setIsOpen(open);
        if (open) {
          const rect = summaryRef.current?.getBoundingClientRect();
          if (rect)
            menuPos.current = {
              top: rect.bottom + window.scrollY,
              left: rect.left,
            };
        }
      }}
    >
      <summary
        className="btn btn-sm btn-ghost m-1 min-w-44 justify-between"
        ref={summaryRef}
      >
        <div className="flex gap-1">
          <HistoryIcon />
          <span>{selectedLabel}</span>
        </div>
        <svg
          className="w-3 h-3 opacity-60"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>

      {isOpen &&
        createPortal(
          <ul
            className="dropdown-content bg-base-100 rounded-box border border-base-300 shadow-md w-52 p-1 max-h-72 overflow-y-auto"
            style={{
              position: 'absolute',
              top: menuPos.current.top,
              left: menuPos.current.left,
              zIndex: 9999,
            }}
          >
            {/* Always-first: All Projects */}
            <li>
              <button
                className={currentSlug === 'all' ? 'active' : ''}
                onClick={() => handleSelect('all')}
              >
                All Projects
              </button>
            </li>

            {visibleCategories.length > 0 && (
              <li className="menu-title text-xs opacity-50 px-2 py-1">
                Categories
              </li>
            )}

            {visibleCategories.map((cat) => (
              <li key={cat.slug}>
                <button
                  className={currentSlug === cat.slug ? 'active' : ''}
                  onClick={() => handleSelect(cat.slug)}
                >
                  {cat.name}
                </button>
              </li>
            ))}

            {/* Conditionally appended: Uncategorized */}
            {hasUncategorized && (
              <>
                <li className="menu-title text-xs opacity-50 px-2 py-1">
                  Other
                </li>
                <li>
                  <button
                    className={currentSlug === 'uncategorized' ? 'active' : ''}
                    onClick={() => handleSelect('uncategorized')}
                  >
                    Uncategorized
                  </button>
                </li>
              </>
            )}
          </ul>,
          document.body,
        )}
    </details>
  );
}
