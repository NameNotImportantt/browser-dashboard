import type { CreateTodoPayload, TodoItem, TodoPriority } from "@/db/types/todo";

export interface TodoWidgetProps {
  todos: TodoItem[];
  onAdd: (payload: CreateTodoPayload) => Promise<void>;
  onToggle: (todoId: string) => Promise<void>;
  onDelete: (todoId: string) => Promise<void>;
  onReorder: (orderedIds: string[]) => Promise<void>;
}

export type { TodoPriority };
