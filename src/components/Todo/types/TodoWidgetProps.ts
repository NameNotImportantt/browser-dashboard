import type { AppLocale, CreateTodoPayload, TodoItem, TodoPriority } from "@/db/types";

export interface TodoWidgetProps {
  todos: TodoItem[];
  locale: AppLocale;
  onAdd: (payload: CreateTodoPayload) => Promise<void>;
  onToggle: (todoId: string) => Promise<void>;
  onDelete: (todoId: string) => Promise<void>;
  onReorder: (orderedIds: string[]) => Promise<void>;
}

export type { TodoPriority };
