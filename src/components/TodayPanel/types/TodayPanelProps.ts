import type { AppLocale, Habit, TodoItem } from "@/db/types";

export interface TodayPanelProps {
  todos: TodoItem[];
  habits: Habit[];
  locale: AppLocale;
}
