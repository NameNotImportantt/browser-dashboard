import type {CreateTodoPayload} from '@/db';

export interface TodosSlice {
  addTodo: (payload: CreateTodoPayload) => Promise<void>;
  toggleTodo: (todoId: string) => Promise<void>;
  deleteTodo: (todoId: string) => Promise<void>;
  reorderTodos: (orderedIds: string[]) => Promise<void>;
}
