import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type KeyboardEvent,
} from 'react';
import Link from 'next/link';
import { useRouter } from '@bprogress/next/app';
import { type SearchResult } from '@/hooks/useSearchIndex';

const SECTION_ICONS: Record<string, string> = {
  overview: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>`,
  projects: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  insights: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>`,
  packages: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-9.5 5.5v7L12 21l9.5-5.5v-7z"/><path d="M12 21V10"/><path d="m2.5 8.5 9.5 5 9.5-5"/></svg>`,
};

type Props = {
  results: SearchResult[];
  query: string;
  onClose: () => void;
  onNavigate?: () => void;
};

export function SearchDropdown({ results, query, onClose, onNavigate }: Props) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [focusedIdx, setFocusedIdx] = useState<number>(-1);

  // Flat list of all navigable sections for keyboard nav
  const flatLinks = results.map((r) => r.sectionPath);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIdx((i) => Math.min(i + 1, flatLinks.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && focusedIdx >= 0) {
        router.push(flatLinks[focusedIdx]);
        onNavigate?.();
        onClose();
      } else if (e.key === 'Escape') {
        onClose();
      }
    },
    [flatLinks, focusedIdx, router, onClose, onNavigate],
  );

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current
          .closest('[data-search-container]')
          ?.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  if (results.length === 0) {
    return (
      <div
        ref={dropdownRef}
        className="search-dropdown absolute top-full left-0 right-0 mt-1 z-50 rounded-xl border border-base-300 bg-base-100 shadow-2xl overflow-hidden"
      >
        <div className="flex flex-col items-center justify-center py-10 px-4 gap-2 text-base-content/40">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <p className="text-sm font-medium">
            No results for{' '}
            <span className="text-base-content/70 font-semibold">
              &quot;{query}&quot;
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      className="search-dropdown absolute top-full left-0 right-0 mt-1 z-50 rounded-xl border border-base-300 bg-base-100 shadow-2xl overflow-hidden outline-none"
    >
      {/* Header hint */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-base-200 bg-base-200/40">
        <span className="text-xs text-base-content/50 font-medium tracking-wide uppercase">
          Search results
        </span>
        <span className="text-xs text-base-content/40">
          {results.reduce((acc, r) => acc + r.matchedItems.length, 0)} matches
        </span>
      </div>

      <div className="max-h-105 overflow-y-auto divide-y divide-base-200/60 search-scroll">
        {results.map((result, sIdx) => (
          <div key={result.section} className="group">
            {/* Section header clickable */}
            <Link
              href={result.sectionPath}
              onClick={() => {
                onNavigate?.();
                onClose();
              }}
              className={`block transition-colors duration-150 px-4 pt-3 pb-1 ${
                focusedIdx === sIdx ? 'bg-primary/10' : 'hover:bg-base-200/60'
              }`}
              onMouseEnter={() => setFocusedIdx(sIdx)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-4 h-4 text-primary/70 shrink-0"
                  dangerouslySetInnerHTML={{
                    __html: SECTION_ICONS[result.section] ?? '',
                  }}
                />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-primary/80 truncate">
                  {result.sectionLabel}
                </span>
                <span className="ml-auto text-[10px] text-base-content/30 font-mono shrink-0">
                  {result.matchedItems.length} match
                  {result.matchedItems.length !== 1 ? 'es' : ''}
                </span>
              </div>
            </Link>

            {/* Matched items list */}
            <ul className="px-4 pb-3 pt-1 space-y-1">
              {result.matchedItems.slice(0, 5).map((item, iIdx) => (
                <li
                  key={iIdx}
                  className="flex items-start gap-2 min-w-0 group-hover:bg-base-200/10 rounded px-2 py-1 transition-colors"
                >
                  <span className="mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary/70 transition-colors" />
                  <div className="min-w-0 flex flex-col">
                    <HighlightedText
                      text={item.label}
                      query={query}
                      className="text-sm font-medium text-base-content leading-tight truncate"
                    />
                    {item.sublabel && (
                      <HighlightedText
                        text={item.sublabel}
                        query={query}
                        className="text-xs text-base-content/50 leading-tight mt-0.5 truncate"
                      />
                    )}
                  </div>
                </li>
              ))}
              {result.matchedItems.length > 5 && (
                <li className="text-xs text-base-content/40 pl-3.5 pt-0.5">
                  +{result.matchedItems.length - 5} more — open{' '}
                  <span className="font-semibold">{result.sectionLabel}</span>{' '}
                  to see all
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-base-200 bg-base-200/30 flex items-center gap-3 text-[10px] text-base-content/40">
        <span className="flex items-center gap-1">
          <kbd className="kbd kbd-xs">↑↓</kbd> navigate
        </span>
        <span className="flex items-center gap-1">
          <kbd className="kbd kbd-xs">↵</kbd> open
        </span>
        <span className="flex items-center gap-1">
          <kbd className="kbd kbd-xs">esc</kbd> close
        </span>
      </div>
    </div>
  );
}

// ─── Highlight matching text ──────────────────────────────────────────────────

function HighlightedText({
  text,
  query,
  className,
}: {
  text: string;
  query: string;
  className?: string;
}) {
  if (!query || !text) return <span className={className}>{text}</span>;

  const terms = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  if (!terms.length) return <span className={className}>{text}</span>;

  const regex = new RegExp(`(${terms.join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-primary/20 text-primary rounded-xs px-px not-italic font-semibold"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
}
