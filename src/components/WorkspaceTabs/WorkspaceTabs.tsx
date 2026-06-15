import type { WorkspaceTabsProps } from "@/components/WorkspaceTabs/types/WorkspaceTabsProps";
import styles from "./WorkspaceTabs.module.scss";

export function WorkspaceTabs({ workspaces, activeWorkspaceId, onSelect }: WorkspaceTabsProps) {
  return (
    <nav className={styles.workspaceTabs} aria-label="Воркспейсы">
      <div className={styles.tabsList} role="tablist">
        {workspaces.map(workspace => {
          const isActive = workspace.id === activeWorkspaceId;

          return (
            <button
              key={workspace.id}
              type="button"
              role="tab"
              className={isActive ? styles.isActive : undefined}
              aria-selected={isActive}
              onClick={() => onSelect(workspace.id)}
            >
              {workspace.name}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
