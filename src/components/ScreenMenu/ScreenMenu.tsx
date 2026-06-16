import { Settings } from "lucide-react";
import { t } from "@/app/i18n";
import type { AppLocale } from "@/db/types/settings";
import type { ScreenId, ScreenMenuProps } from "@/components/ScreenMenu/types/ScreenMenuProps";
import styles from "./ScreenMenu.module.scss";

const SCREENS: { id: ScreenId; labelKey: "navHome" | "navTodo" | "navHabits" | "navNotes" }[] = [
  { id: "home", labelKey: "navHome" },
  { id: "todo", labelKey: "navTodo" },
  { id: "habits", labelKey: "navHabits" },
  { id: "notes", labelKey: "navNotes" },
];

export function ScreenMenu({ activeScreen, locale, onSelect }: ScreenMenuProps) {
  const isSettingsActive = activeScreen === "settings";

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
            {t(locale, screen.labelKey)}
          </button>
        );
      })}

      <button
        type="button"
        className={`${styles.iconButton} ${isSettingsActive ? styles.isActive : ""}`}
        aria-current={isSettingsActive ? "page" : undefined}
        aria-label={t(locale, "settings")}
        onClick={() => onSelect("settings")}
      >
        <Settings size={16} strokeWidth={2.25} />
      </button>
    </nav>
  );
}
