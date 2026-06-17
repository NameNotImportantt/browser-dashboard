import type { AppLocale, CustomSearchEngine } from "@/db/types";
import type { SearchHistoryEntry } from "@/db/types/searchHistory";

export interface SearchCoreProps {
  locale: AppLocale;
  activeSearchEngineId: string;
  customSearchEngines: CustomSearchEngine[];
  searchHistory: SearchHistoryEntry[];
  onEngineChange: (engineId: string) => Promise<void>;
  onAddSearchHistory: (query: string) => Promise<void>;
}
