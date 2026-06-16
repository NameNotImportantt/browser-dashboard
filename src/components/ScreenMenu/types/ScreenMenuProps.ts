import type { AppLocale } from "@/db/types";

export type ScreenId = "home" | "todo" | "habits" | "notes" | "settings";

export interface ScreenMenuProps {
  activeScreen: ScreenId;
  locale: AppLocale;
  onSelect: (screen: ScreenId) => void;
}
