import type { CustomSearchEngine } from "@/db/types";

export const BUILTIN_SEARCH_ENGINES = [
  { id: "google", name: "Google", urlTemplate: "https://www.google.com/search?q={q}" },
  { id: "duckduckgo", name: "DuckDuckGo", urlTemplate: "https://duckduckgo.com/?q={q}" },
] as const;

export const SEARCH_URL_HINT = "https://example.com/search?q={q}";

export function buildSearchUrl(engineId: string, query: string, customEngines: CustomSearchEngine[]) {
  const encoded = encodeURIComponent(query.trim());
  const builtin = BUILTIN_SEARCH_ENGINES.find(engine => engine.id === engineId);

  if (builtin) {
    return builtin.urlTemplate.replace("{q}", encoded);
  }

  const custom = customEngines.find(engine => engine.id === engineId);
  if (custom?.urlTemplate.includes("{q}")) {
    return custom.urlTemplate.replace(/\{q\}/g, encoded);
  }

  return BUILTIN_SEARCH_ENGINES[1].urlTemplate.replace("{q}", encoded);
}

export function getSearchEngineOptions(customEngines: CustomSearchEngine[]) {
  return [
    ...BUILTIN_SEARCH_ENGINES.map(engine => ({ id: engine.id, name: engine.name })),
    ...customEngines.map(engine => ({ id: engine.id, name: engine.name })),
  ];
}

export function isValidSearchUrlTemplate(template: string) {
  return template.includes("{q}") && /^https?:\/\//i.test(template.trim());
}
