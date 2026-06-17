import { Home, Settings, type LucideIcon } from "lucide-react";
import { t } from "@/app";
import type { ScreenId, ScreenMenuProps } from "./types/ScreenMenuProps";
import styles from "./ScreenMenu.module.scss";

const SCREENS: {
  id: ScreenId;
  labelKey: "navHome" | "navTodo" | "navHabits" | "navNotes";
  icon?: LucideIcon;
}[] = [
  { id: "home", labelKey: "navHome", icon: Home },
  { id: "todo", labelKey: "navTodo" },
  { id: "habits", labelKey: "navHabits" },
  { id: "notes", labelKey: "navNotes" },
];

export function ScreenMenu({ activeScreen, locale, onSelect }: ScreenMenuProps) {
  const isSettingsActive = activeScreen === "settings";

  return (
    <nav className={styles.screenMenu} aria-label={t(locale, "screenNavAriaLabel")}>
      {SCREENS.map(screen => {
        const isActive = screen.id === activeScreen;

        const Icon = screen.icon;

        return (
          <button
            key={screen.id}
            type="button"
            className={`${Icon ? styles.iconButton : ""} ${isActive ? styles.isActive : ""}`.trim() || undefined}
            aria-current={isActive ? "page" : undefined}
            aria-label={Icon ? t(locale, screen.labelKey) : undefined}
            onClick={() => onSelect(screen.id)}
          >
            {Icon ? <Icon size={16} strokeWidth={2.25} /> : t(locale, screen.labelKey)}
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
