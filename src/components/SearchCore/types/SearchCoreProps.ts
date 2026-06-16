import type { CustomSearchEngine } from "@/db/types/settings";

export interface SearchCoreProps {
  activeSearchEngineId: string;
  customSearchEngines: CustomSearchEngine[];
  onEngineChange: (engineId: string) => Promise<void>;
}
