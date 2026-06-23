import {
    useCallback,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
    type FormEvent,
    type KeyboardEvent,
} from 'react';
import clsx from 'clsx';
import {Clock, Globe, Search} from 'lucide-react';
import {
    buildSearchUrl,
    getLocalSearchSuggestions,
    getSearchEngineOptions,
    loadSearchSuggestions,
    t,
    type SearchSuggestion,
} from '@/app';
import {Select} from '@/components/Select';
import {useSearchHistory, useSettings} from '@/dashboard';
import {SUGGESTION_DEBOUNCE_MS} from './constants';
import styles from './SearchCore.module.scss';
import type {AppLocale} from '@/db';

interface SearchCoreProps {
  focusRequestId?: number;
  dismissRequestId?: number;
}

function suggestionSourceLabel(locale: AppLocale, source: SearchSuggestion['source']) {
    if (source === 'history') {
        return t(locale, 'searchSuggestionHistory');
    }

    return t(locale, 'searchSuggestionOnline');
}

export function SearchCore({focusRequestId = 0, dismissRequestId = 0}: SearchCoreProps) {
    const {settings, locale, setActiveSearchEngineId} = useSettings();
    const {searchHistory, addSearchHistoryEntry} = useSearchHistory();
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [isFocused, setIsFocused] = useState(false);

    const wrapRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const abortRef = useRef<AbortController | null>(null);
    const listboxId = useId();

    const engineOptions = getSearchEngineOptions(settings.customSearchEngines);

    const engineSelectOptions = useMemo(
        () => engineOptions.map(option => ({value: option.id, label: option.name})),
        [engineOptions],
    );

    const closeSuggestions = useCallback(() => {
        setIsOpen(false);
        setActiveIndex(-1);
    }, []);

    const openSearch = useCallback(
        (searchQuery: string) => {
            const trimmed = searchQuery.trim();

            if (!trimmed) {
                return;
            }

            void addSearchHistoryEntry(trimmed).catch(() => undefined);
            const url = buildSearchUrl(settings.activeSearchEngineId, trimmed, settings.customSearchEngines);

            window.open(url, '_blank', 'noopener,noreferrer');
            setQuery('');
            closeSuggestions();
            inputRef.current?.focus();
        },
        [addSearchHistoryEntry, closeSuggestions, settings.activeSearchEngineId, settings.customSearchEngines],
    );

    const selectSuggestion = useCallback(
        (suggestion: SearchSuggestion) => {
            openSearch(suggestion.label);
        },
        [openSearch],
    );

    useEffect(() => {
        const timer = window.setTimeout(() => setDebouncedQuery(query), SUGGESTION_DEBOUNCE_MS);

        return () => window.clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        const trimmed = debouncedQuery.trim();
        const local = getLocalSearchSuggestions(debouncedQuery, searchHistory);

        setSuggestions(local);
        setIsOpen(local.length > 0 && (trimmed.length > 0 || isFocused));
        setActiveIndex(-1);

        if (!trimmed) {
            abortRef.current?.abort();
            return;
        }

        if (!settings.onlineSearchSuggestionsEnabled) {
            abortRef.current?.abort();
            return;
        }

        abortRef.current?.abort();
        const controller = new AbortController();

        abortRef.current = controller;

        void loadSearchSuggestions(debouncedQuery, searchHistory, controller.signal)
            .then(result => {
                if (controller.signal.aborted) {
                    return;
                }

                setSuggestions(result);
                setIsOpen(result.length > 0 && (trimmed.length > 0 || isFocused));
                setActiveIndex(-1);
            })
            .catch(() => undefined);

        return () => controller.abort();
    }, [debouncedQuery, isFocused, searchHistory, settings.onlineSearchSuggestionsEnabled]);

    useEffect(() => {
        if (!isOpen || activeIndex < 0) {
            return;
        }

        document.getElementById(`${listboxId}-option-${activeIndex}`)?.scrollIntoView({block: 'nearest'});
    }, [activeIndex, isOpen, listboxId]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handlePointerDown = (event: MouseEvent) => {
            const target = event.target as Node;

            if (wrapRef.current?.contains(target)) {
                return;
            }

            closeSuggestions();
        };

        document.addEventListener('mousedown', handlePointerDown);
        return () => document.removeEventListener('mousedown', handlePointerDown);
    }, [closeSuggestions, isOpen]);

    useEffect(() => {
        inputRef.current?.focus();
    }, [focusRequestId]);

    useEffect(() => {
        closeSuggestions();
    }, [closeSuggestions, dismissRequestId]);

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isOpen && activeIndex >= 0 && suggestions[activeIndex]) {
            selectSuggestion(suggestions[activeIndex]);
            return;
        }

        openSearch(query);
    };

    const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Escape') {
            closeSuggestions();
            return;
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();

            if (!suggestions.length) {
                return;
            }

            setIsOpen(true);
            setActiveIndex(prev => (prev + 1) % suggestions.length);
            return;
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();

            if (!suggestions.length) {
                return;
            }

            setIsOpen(true);
            setActiveIndex(prev => (prev <= 0 ? suggestions.length - 1 : prev - 1));
        }
    };

    const showSuggestions = isOpen && suggestions.length > 0;

    return (
        <section className={styles.searchCore} aria-label={t(locale, 'searchAriaLabel')}>
            <form className={styles.searchForm} onSubmit={submit}>
                <div className={styles.searchInputWrap} ref={wrapRef}>
                    <label className={styles.searchField}>
                        <Search className={styles.searchIcon} size={22} strokeWidth={2.25} aria-hidden />
                        <input
                            className={styles.searchInput}
                            ref={inputRef}
                            value={query}
                            onChange={event => setQuery(event.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => {
                                window.setTimeout(() => setIsFocused(false), 120);
                            }}
                            onKeyDown={handleInputKeyDown}
                            placeholder={t(locale, 'searchPlaceholder')}
                            aria-label={t(locale, 'searchAriaLabel')}
                            aria-expanded={showSuggestions}
                            aria-controls={showSuggestions ? listboxId : undefined}
                            aria-activedescendant={
                                showSuggestions && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
                            }
                            aria-autocomplete="list"
                            role="combobox"
                            autoComplete="off"
                            autoFocus
                        />
                    </label>

                    {showSuggestions ? (
                        <ul
                            id={listboxId}
                            className={styles.suggestions}
                            role="listbox"
                            aria-label={t(locale, 'searchSuggestionsAriaLabel')}
                        >
                            {suggestions.map((suggestion, index) => {
                                const SourceIcon = suggestion.source === 'history' ? Clock : Globe;

                                const suggestionClassName = clsx(styles.suggestion, {
                                    [styles.suggestionActive]: index === activeIndex,
                                });

                                return (
                                    <li
                                        key={suggestion.id}
                                        id={`${listboxId}-option-${index}`}
                                        role="option"
                                        aria-selected={index === activeIndex}
                                        className={suggestionClassName}
                                        onMouseEnter={() => setActiveIndex(index)}
                                        onMouseDown={event => {
                                            event.preventDefault();
                                            selectSuggestion(suggestion);
                                        }}
                                    >
                                        <SourceIcon className={styles.suggestionIcon} size={14} strokeWidth={2.1} aria-hidden />
                                        <span className={styles.suggestionLabel}>{suggestion.label}</span>
                                        <span className={styles.suggestionMeta}>{suggestionSourceLabel(locale, suggestion.source)}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : null}
                </div>

                <Select
                    className={styles.engineSelect}
                    triggerClassName={styles.engineTrigger}
                    dismissRequestId={dismissRequestId}
                    value={settings.activeSearchEngineId}
                    options={engineSelectOptions}
                    onChange={value => void setActiveSearchEngineId(value)}
                    ariaLabel={t(locale, 'searchEngineAriaLabel')}
                />
            </form>
        </section>
    );
}
