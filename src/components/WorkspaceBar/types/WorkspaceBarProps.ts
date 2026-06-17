import type { AppLocale, Workspace } from "@/db/types";

export interface WorkspaceBarProps {
  locale: AppLocale;
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  onSelect: (id: string) => void;
  onAdd: (name: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}
