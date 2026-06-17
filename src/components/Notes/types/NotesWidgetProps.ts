import type { AppLocale } from "@/db/types";

export interface NotesWidgetProps {
  text: string;
  locale: AppLocale;
  onSave: (text: string) => Promise<void>;
}
