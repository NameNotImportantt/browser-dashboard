import type { CustomSearchEngine } from "@/db/types/settings";

export interface SearchBarProps {
  activeSearchEngineId: string;
  customSearchEngines: CustomSearchEngine[];
}
