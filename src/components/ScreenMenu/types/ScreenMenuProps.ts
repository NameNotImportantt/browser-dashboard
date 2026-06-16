import type { AppLocale } from "@/db/types/settings";

export type ScreenId = "home" | "todo" | "habits" | "notes" | "settings";

export interface ScreenMenuProps {
  activeScreen: ScreenId;
  locale: AppLocale;
  onSelect: (screen: ScreenId) => void;
}
