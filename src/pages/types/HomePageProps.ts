import type { CreateBookmarkPayload } from "@/db/types/bookmark";
import type { Bookmark } from "@/db/types/bookmark";
import type { Habit } from "@/db/types/habit";
import type { SearchEngine, ThemeMode } from "@/db/types/settings";
import type { CreateTodoPayload, TodoItem } from "@/db/types/todo";
import type { WeatherCache } from "@/db/types/weather";
import type { Workspace } from "@/db/types/workspace";

export interface HomePageProps {
  timeLabel: string;
  dateLabel: string;
  theme: ThemeMode;
  searchEngine: SearchEngine;
  weather: WeatherCache | null;
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  todos: TodoItem[];
  habits: Habit[];
  bookmarks: Bookmark[];
  noteText: string;
  onThemeToggle: (theme: ThemeMode) => Promise<void>;
  onSearchEngineChange: (engine: SearchEngine) => Promise<void>;
  onRefreshWeather: () => Promise<void>;
  onSelectWorkspace: (id: string) => Promise<void>;
  onAddWorkspace: (name: string) => Promise<void>;
  onDeleteWorkspace: (id: string) => Promise<void>;
  onAddTodo: (payload: CreateTodoPayload) => Promise<void>;
  onToggleTodo: (todoId: string) => Promise<void>;
  onDeleteTodo: (todoId: string) => Promise<void>;
  onReorderTodo: (orderedIds: string[]) => Promise<void>;
  onAddHabit: (title: string) => Promise<void>;
  onToggleHabitToday: (habitId: string) => Promise<void>;
  onDeleteHabit: (habitId: string) => Promise<void>;
  onAddBookmark: (payload: CreateBookmarkPayload) => Promise<void>;
  onDeleteBookmark: (bookmarkId: string) => Promise<void>;
  onSaveNote: (text: string) => Promise<void>;
}
