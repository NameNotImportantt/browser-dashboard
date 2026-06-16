import { useState, type FormEvent } from "react";
import type { WorkspaceBarProps } from "./types/WorkspaceBarProps";
import styles from "./WorkspaceBar.module.scss";

export function WorkspaceBar({ workspaces, activeWorkspaceId, onSelect, onAdd, onDelete }: WorkspaceBarProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [hoveredWorkspaceId, setHoveredWorkspaceId] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = name.trim();
    if (!value) return;

    await onAdd(value);
    setName("");
    setIsAdding(false);
  };

  return (
    <nav className={styles.workspaceBar} aria-label="Воркспейсы">
      {workspaces.map((workspace, index) => {
        const isActive = workspace.id === activeWorkspaceId;

        return (
          <span
            className={`${styles.workspaceItem} ${hoveredWorkspaceId === workspace.id ? styles.isHovered : ""}`}
            key={workspace.id}
            onMouseEnter={() => setHoveredWorkspaceId(workspace.id)}
            onMouseLeave={() => setHoveredWorkspaceId(null)}
          >
            {index > 0 ? <span className={styles.separator} aria-hidden>|</span> : null}
            <span className={styles.workspaceControl}>
              <button
                type="button"
                className={`${styles.workspaceButton} ${isActive ? styles.isActive : ""}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => onSelect(workspace.id)}
              >
                {workspace.name.toUpperCase()}
              </button>
              {workspaces.length > 1 ? (
                <button
                  type="button"
                  className={`${styles.removeButton} ${hoveredWorkspaceId === workspace.id ? styles.isVisible : ""}`}
                  onClick={() => void onDelete(workspace.id)}
                  aria-label={`Удалить ${workspace.name}`}
                >
                  ×
                </button>
              ) : null}
            </span>
          </span>
        );
      })}

      {isAdding ? (
        <form className={styles.addForm} onSubmit={submit}>
          <input
            value={name}
            onChange={event => setName(event.target.value)}
            placeholder="Название"
            aria-label="Название воркспейса"
            autoFocus
            required
          />
          <button className="primary" type="submit">
            +
          </button>
          <button type="button" onClick={() => setIsAdding(false)}>
            ×
          </button>
        </form>
      ) : (
        <>
          {workspaces.length > 0 ? <span className={styles.separator} aria-hidden>|</span> : null}
          <button type="button" className={styles.addButton} onClick={() => setIsAdding(true)} aria-label="Добавить воркспейс">
            +
          </button>
        </>
      )}
    </nav>
  );
}
