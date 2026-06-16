import { useEffect } from "react";
import { applyCustomTextColors } from "./themeTextColors";
import { DEFAULT_TAB_TITLE } from "./settingsDefaults";
import { WEATHER_CACHE_TTL_MS } from "./utils";
import { HomePage } from "@/pages";
import { useClock, useDashboardData } from "@/hooks";
import styles from "./AppShell.module.scss";

export function AppShell() {
  const dashboard = useDashboardData();
  const { settings } = dashboard;
  const { dateLabel, timeLabel } = useClock({
    locale: settings.locale,
    timeFormat: settings.timeFormat,
    dateFormat: settings.dateFormat,
    timezone: settings.timezone,
  });

  const {
    loading,
    error,
    weatherCache,
    workspaces,
    activeWorkspaceId,
    todos,
    habits,
    bookmarks,
    bookmarkCategories,
    noteText,
    actions,
  } = dashboard;

  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme;
  }, [settings.theme]);

  useEffect(() => {
    applyCustomTextColors(settings.theme, settings.customTextColors);
  }, [settings.theme, settings.customTextColors]);

  useEffect(() => {
    const root = document.documentElement;

    if (settings.customBackgroundImage) {
      root.dataset.customBg = "true";
      root.style.setProperty("--app-bg-image", `url("${settings.customBackgroundImage}")`);
      return;
    }

    delete root.dataset.customBg;
    root.style.removeProperty("--app-bg-image");
  }, [settings.customBackgroundImage]);

  useEffect(() => {
    document.documentElement.lang = settings.locale;
  }, [settings.locale]);

  useEffect(() => {
    document.title = settings.tabTitle.trim() || DEFAULT_TAB_TITLE;
  }, [settings.tabTitle]);

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
      settings={settings}
      weather={weatherCache}
      workspaces={workspaces}
      activeWorkspaceId={activeWorkspaceId}
      todos={todos}
      habits={habits}
      bookmarks={bookmarks}
      bookmarkCategories={bookmarkCategories}
      noteText={noteText}
      onThemeToggle={actions.setTheme}
      onActiveSearchEngineChange={actions.setActiveSearchEngineId}
      onTimeFormatChange={actions.setTimeFormat}
      onTimezoneChange={actions.setTimezone}
      onLocaleChange={actions.setLocale}
      onDateFormatChange={actions.setDateFormat}
      onTabTitleChange={actions.setTabTitle}
      onBackgroundImageChange={actions.setBackgroundImageFromFile}
      onBackgroundImageRemove={actions.clearBackgroundImage}
      onTextColorChange={actions.setTextColor}
      onTextColorsReset={actions.resetTextColors}
      onAddCustomSearchEngine={actions.addCustomSearchEngine}
      onRemoveCustomSearchEngine={actions.removeCustomSearchEngine}
      onWeatherCityChange={actions.setWeatherCity}
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
      onAddBookmarkCategory={actions.addBookmarkCategory}
      onDeleteBookmarkCategory={actions.deleteBookmarkCategory}
      onSaveNote={actions.saveNote}
    />
  );
}
