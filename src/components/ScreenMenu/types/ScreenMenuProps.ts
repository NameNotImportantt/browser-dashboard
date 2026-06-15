export type ScreenId = "home" | "todo" | "habits" | "notes";

export interface ScreenMenuProps {
  activeScreen: ScreenId;
  onSelect: (screen: ScreenId) => void;
}
