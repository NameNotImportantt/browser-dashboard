import type { CustomSearchEngine } from "@/db/types";

export interface SearchCoreProps {
  activeSearchEngineId: string;
  customSearchEngines: CustomSearchEngine[];
  onEngineChange: (engineId: string) => Promise<void>;
}
