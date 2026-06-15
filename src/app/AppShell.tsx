import { useEffect } from "react";
import { HomePage } from "@/pages/HomePage";
import { useClock } from "@/hooks/useClock";
import { useDashboardData } from "@/hooks/useDashboardData";
import { WEATHER_CACHE_TTL_MS } from "@/app/utils";
import styles from "./AppShell.module.scss";

export function AppShell() {
  const { dateLabel, timeLabel } = useClock();
  const dashboard = useDashboardData();

  const {
    loading,
    error,
    weatherCache,
    settings,
    workspaces,
    activeWorkspaceId,
    todos,
    habits,
    bookmarks,
    noteText,
    actions,
  } = dashboard;

  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme;
  }, [settings.theme]);

  useEffect(() => {
    if (loading) return;
    const cacheIsFresh = weatherCache ? Date.now() - weatherCache.fetchedAt < WEATHER_CACHE_TTL_MS : false;
    if (cacheIsFresh) return;
    void actions.refreshWeather(false).catch(() => undefined);
  }, [actions, loading, weatherCache]);

  if (loading) {
    return <main className={styles.statusView}>Загрузка...</main>;
  }

  if (error) {
    return (
      <main className={styles.statusView}>
        <p>Ошибка загрузки: {error}</p>
        <button type="button" onClick={() => void actions.refresh()}>
          Повторить
        </button>
      </main>
    );
  }

  return (
    <HomePage
      timeLabel={timeLabel}
      dateLabel={dateLabel}
      theme={settings.theme}
      searchEngine={settings.searchEngine}
      weather={weatherCache}
      workspaces={workspaces}
      activeWorkspaceId={activeWorkspaceId}
      todos={todos}
      habits={habits}
      bookmarks={bookmarks}
      noteText={noteText}
      onThemeToggle={actions.setTheme}
      onSearchEngineChange={actions.setSearchEngine}
      onRefreshWeather={() => actions.refreshWeather(true)}
      onSelectWorkspace={actions.selectWorkspace}
      onAddWorkspace={actions.addWorkspace}
      onDeleteWorkspace={actions.deleteWorkspace}
      onAddTodo={actions.addTodo}
      onToggleTodo={actions.toggleTodo}
      onDeleteTodo={actions.deleteTodo}
      onReorderTodo={actions.reorderTodos}
      onAddHabit={actions.addHabit}
      onToggleHabitToday={actions.toggleHabitToday}
      onDeleteHabit={actions.deleteHabit}
      onAddBookmark={actions.addBookmark}
      onDeleteBookmark={actions.deleteBookmark}
      onSaveNote={actions.saveNote}
    />
  );
}
