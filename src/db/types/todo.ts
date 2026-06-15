export type TodoPriority = "low" | "medium" | "high";

export interface TodoItem {
  id: string;
  workspaceId: string;
  title: string;
  completed: boolean;
  priority: TodoPriority;
  dueDate: string | null;
  position: number;
  createdAt: number;
  updatedAt: number;
}

export interface CreateTodoPayload {
  title: string;
  priority: TodoPriority;
  dueDate: string | null;
}
