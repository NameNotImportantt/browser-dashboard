import type {SearchHistoryEntry} from '@/db';

export type SearchSuggestionSource = 'history' | 'online';

export interface SearchSuggestion {
  id: string;
  label: string;
  source: SearchSuggestionSource;
}

const MAX_SUGGESTIONS = 8;
const JSONP_TIMEOUT_MS = 5000;

type SearchSuggestionsJsonPrimitive = string | number | boolean | null;

interface SearchSuggestionsJsonObject {
  [key: string]: SearchSuggestionsJsonValue | undefined;
}

type SearchSuggestionsJsonValue =
    | SearchSuggestionsJsonPrimitive
    | SearchSuggestionsJsonObject
    | SearchSuggestionsJsonValue[];

function normalizeQuery(query: string) {
    return query.trim().toLowerCase();
}

function suggestionKey(label: string) {
    return label.trim().toLowerCase();
}

function matchesQuery(haystack: string, normalized: string) {
    if (haystack.includes(normalized)) {
        return true;
    }

    const tokens = normalized.split(/\s+/).filter(Boolean);

    return tokens.length > 0 && tokens.every(token => haystack.includes(token));
}

function mapHistoryEntry(entry: SearchHistoryEntry): SearchSuggestion {
    return {
        id: `history:${entry.id}`,
        label: entry.query,
        source: 'history',
    };
}

export function getLocalSearchSuggestions(query: string, history: SearchHistoryEntry[]): SearchSuggestion[] {
    const normalized = normalizeQuery(query);

    if (!normalized) {
        return history.slice(0, MAX_SUGGESTIONS).map(mapHistoryEntry);
    }

    const result: SearchSuggestion[] = [];
    const seen = new Set<string>();

    for (const entry of history) {
        const key = suggestionKey(entry.query);

        if (seen.has(key) || !matchesQuery(key, normalized)) {
            continue;
        }

        seen.add(key);
        result.push(mapHistoryEntry(entry));

        if (result.length >= MAX_SUGGESTIONS) {
            break;
        }
    }

    return result;
}

export function fetchGoogleSuggestionsJsonp(query: string, signal: AbortSignal): Promise<string[]> {
    const trimmed = query.trim();

    if (!trimmed) {
        return Promise.resolve([]);
    }

    return new Promise((resolve, reject) => {
        const callbackName = `googleAc_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        const script = document.createElement('script');
        let timeoutId: number | null = null;

        const cleanup = () => {
            Reflect.deleteProperty(window, callbackName);
            script.remove();
            signal.removeEventListener('abort', onAbort);

            if (timeoutId !== null) {
                window.clearTimeout(timeoutId);
            }
        };

        function onAbort() {
            cleanup();
            reject(new DOMException('Aborted', 'AbortError'));
        }

        timeoutId = window.setTimeout(() => {
            cleanup();
            resolve([]);
        }, JSONP_TIMEOUT_MS);

        Reflect.set(window, callbackName, (data: SearchSuggestionsJsonValue | undefined) => {
            cleanup();

            if (!Array.isArray(data) || !Array.isArray(data[1])) {
                resolve([]);
                return;
            }

            resolve(data[1].filter((item): item is string => typeof item === 'string'));
        });

        script.async = true;

        script.onerror = () => {
            cleanup();
            resolve([]);
        };

        signal.addEventListener('abort', onAbort);
        script.src = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(trimmed)}&callback=${callbackName}`;
        document.head.appendChild(script);
    });
}

export async function loadSearchSuggestions(
    query: string,
    history: SearchHistoryEntry[],
    signal: AbortSignal,
): Promise<SearchSuggestion[]> {
    const local = getLocalSearchSuggestions(query, history);
    const trimmed = query.trim();

    if (!trimmed) {
        return local;
    }

    const seen = new Set(local.map(item => suggestionKey(item.label)));
    const result = [...local];

    try {
        const online = await fetchGoogleSuggestionsJsonp(trimmed, signal);

        for (const label of online) {
            const key = suggestionKey(label);

            if (seen.has(key)) {
                continue;
            }

            seen.add(key);
            result.push({
                id: `online:${key}`,
                label,
                source: 'online',
            });

            if (result.length >= MAX_SUGGESTIONS) {
                break;
            }
        }
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            throw error;
        }
    }

    return result.slice(0, MAX_SUGGESTIONS);
}
