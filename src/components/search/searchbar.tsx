import { useRef, useState, useEffect, useCallback } from 'react';
import { SanitizedConfig } from '../../interfaces/sanitized-config';
import { useSearchResults } from '../../hooks/useSearchIndex';
import { SearchDropdown } from './dropdown';
import { Profile } from '../../interfaces/profile';

type UnifiedProject = {
  id: string;
  name: string;
  shortDescription: string;
  stack: string[];
  year: string;
};

type Props = {
  sanitizedConfig: SanitizedConfig | Record<string, never>;
  unifiedProjects: UnifiedProject[];
  profile: Profile | null;
  /** Optional: called when user navigates to a result (e.g. close mobile menu) */
  onNavigate?: () => void;
  onClose?: () => void;
};

export function SearchBar({
  sanitizedConfig,
  unifiedProjects,
  profile,
  onNavigate,
  onClose,
}: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useSearchResults(
    query,
    sanitizedConfig,
    unifiedProjects,
    profile,
  );

  // Open when there's a query; close on empty
  useEffect(() => {
    setOpen(query.trim().length >= 2);
  }, [query]);

  // Keyboard shortcut: '/' focuses the search bar
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      if (e.key === '/' && tag !== 'input' && tag !== 'textarea') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);

  const handleNavigate = useCallback(() => {
    setQuery('');
    setOpen(false);
    onNavigate?.();
    inputRef.current?.blur();
    onClose?.();
  }, [onNavigate, onClose]);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        onClose?.();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div
      ref={containerRef}
      data-search-container
      className="relative w-full max-w-xs lg:max-w-sm xl:max-w-md"
    >
      {/* Input */}
      <div className="relative">
        {/* Search icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setQuery('');
              setOpen(false);
              inputRef.current?.blur();
              onClose?.();
            }
          }}
          placeholder="Search…"
          aria-label="Search portfolio"
          aria-expanded={open}
          aria-haspopup="listbox"
          role="combobox"
          autoComplete="off"
          spellCheck={false}
          className={`
            w-full pl-9 pr-9 py-2 text-sm rounded-lg
            bg-base-200/60 border border-base-300
            text-base-content placeholder:text-base-content/40
            outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
            transition-all duration-200
            ${open ? 'rounded-b-none border-b-transparent ring-2 ring-primary/30 border-primary/50' : ''}
          `}
        />

        {/* Keyboard shortcut hint or clear button */}
        {query ? (
          <button
            onClick={() => {
              setQuery('');
              setOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors"
            aria-label="Clear search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        ) : (
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 kbd kbd-xs text-base-content/30 pointer-events-none hidden sm:inline-flex">
            /
          </kbd>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <SearchDropdown
          results={results}
          query={query}
          onClose={handleClose}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}
