import type {
  AppSettings,
  Bookmark,
  BookmarkCategory,
  CreateBookmarkCategoryPayload,
  CreateBookmarkPayload,
  CreateTodoPayload,
  Habit,
  TextColorKey,
  ThemeMode,
  TodoItem,
  WeatherCache,
  Workspace,
} from "@/db/types";
import type { SearchHistoryEntry } from "@/db/types/searchHistory";

export interface HomePageProps {
  timeLabel: string;
  dateLabel: string;
  theme: ThemeMode;
  settings: AppSettings;
  weather: WeatherCache | null;
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  todos: TodoItem[];
  habits: Habit[];
  bookmarks: Bookmark[];
  bookmarkCategories: BookmarkCategory[];
  searchHistory: SearchHistoryEntry[];
  noteText: string;
  onThemeToggle: (theme: ThemeMode) => Promise<void>;
  onActiveSearchEngineChange: (engineId: string) => Promise<void>;
  onAddSearchHistory: (query: string) => Promise<void>;
  onTimeFormatChange: (format: AppSettings["timeFormat"]) => Promise<void>;
  onTimezoneChange: (timezone: string) => Promise<void>;
  onLocaleChange: (locale: AppSettings["locale"]) => Promise<void>;
  onDateFormatChange: (format: AppSettings["dateFormat"]) => Promise<void>;
  onTabTitleChange: (title: string) => Promise<void>;
  onBackgroundImageChange: (file: File) => Promise<void>;
  onBackgroundImageRemove: () => Promise<void>;
  onBackgroundScrimOpacityChange: (opacity: number) => Promise<void>;
  onTextColorChange: (key: TextColorKey, value: string | null) => Promise<void>;
  onTextColorsReset: () => Promise<void>;
  onAddCustomSearchEngine: (payload: { name: string; urlTemplate: string }) => Promise<void>;
  onRemoveCustomSearchEngine: (engineId: string) => Promise<void>;
  onWeatherCityChange: (city: string) => Promise<void>;
  onRefreshWeather: () => Promise<void>;
  onSelectWorkspace: (workspaceId: string) => Promise<void>;
  onAddWorkspace: (name: string) => Promise<void>;
  onDeleteWorkspace: (workspaceId: string) => Promise<void>;
  onAddTodo: (payload: CreateTodoPayload) => Promise<void>;
  onToggleTodo: (todoId: string) => Promise<void>;
  onDeleteTodo: (todoId: string) => Promise<void>;
  onReorderTodo: (orderedIds: string[]) => Promise<void>;
  onAddHabit: (title: string) => Promise<void>;
  onToggleHabitToday: (habitId: string) => Promise<void>;
  onDeleteHabit: (habitId: string) => Promise<void>;
  onAddBookmark: (payload: CreateBookmarkPayload) => Promise<void>;
  onDeleteBookmark: (bookmarkId: string) => Promise<void>;
  onAddBookmarkCategory: (payload: CreateBookmarkCategoryPayload) => Promise<void>;
  onDeleteBookmarkCategory: (categoryId: string) => Promise<void>;
  onSaveNote: (text: string) => Promise<void>;
}
