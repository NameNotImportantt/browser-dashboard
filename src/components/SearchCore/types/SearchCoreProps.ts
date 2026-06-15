import type { SearchEngine } from "@/db/types/settings";

export interface SearchCoreProps {
  engine: SearchEngine;
  onEngineChange: (engine: SearchEngine) => Promise<void>;
}
