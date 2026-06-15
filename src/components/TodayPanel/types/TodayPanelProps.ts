import type { Habit } from "@/db/types/habit";
import type { TodoItem } from "@/db/types/todo";

export interface TodayPanelProps {
  todos: TodoItem[];
  habits: Habit[];
}
