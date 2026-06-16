import type { Habit } from "@/db/types";

export interface HabitsWidgetProps {
  habits: Habit[];
  onAdd: (title: string) => Promise<void>;
  onToggleToday: (habitId: string) => Promise<void>;
  onDelete: (habitId: string) => Promise<void>;
}
