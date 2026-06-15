import type { ScreenId, ScreenMenuProps } from "@/components/ScreenMenu/types/ScreenMenuProps";
import styles from "./ScreenMenu.module.scss";

const SCREENS: { id: ScreenId; label: string }[] = [
  { id: "home", label: "HOME" },
  { id: "todo", label: "TODO" },
  { id: "habits", label: "HABITS" },
  { id: "notes", label: "NOTES" },
];

export function ScreenMenu({ activeScreen, onSelect }: ScreenMenuProps) {
  return (
    <nav className={styles.screenMenu} aria-label="Навигация по экранам">
      {SCREENS.map(screen => {
        const isActive = screen.id === activeScreen;

        return (
          <button
            key={screen.id}
            type="button"
            className={isActive ? styles.isActive : undefined}
            aria-current={isActive ? "page" : undefined}
            onClick={() => onSelect(screen.id)}
          >
            {screen.label}
          </button>
        );
      })}
    </nav>
  );
}
