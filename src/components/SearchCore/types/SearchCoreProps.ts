import type { AppLocale, CustomSearchEngine } from "@/db/types";

export interface SearchCoreProps {
  locale: AppLocale;
  activeSearchEngineId: string;
  customSearchEngines: CustomSearchEngine[];
  onEngineChange: (engineId: string) => Promise<void>;
}
