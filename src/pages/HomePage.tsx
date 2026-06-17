import { lazy, memo, Suspense, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { t } from "@/app";
import {
  QuickLinks,
  ScreenMenu,
  screenMenuStyles,
  SearchCore,
  SettingsPanel,
  TodayPanel,
  TodoWidget,
  TopBar,
  WorkspaceBar,
  type ScreenId,
} from "@/components";
import type { HomePageProps } from "@/pages";
import styles from "./HomePage.module.scss";

const HabitsWidget = lazy(() => import("@/components").then(module => ({ default: module.HabitsWidget })));
const NotesWidget = lazy(() => import("@/components").then(module => ({ default: module.NotesWidget })));

export const HomePage = memo(function HomePage(props: HomePageProps) {
  const {
    timeLabel,
    dateLabel,
    theme,
    settings,
    weather,
    workspaces,
    activeWorkspaceId,
    todos,
    habits,
    bookmarks,
    bookmarkCategories,
    noteText,
    onThemeToggle,
    onActiveSearchEngineChange,
    onTimeFormatChange,
    onTimezoneChange,
    onLocaleChange,
    onDateFormatChange,
    onTabTitleChange,
    onBackgroundImageChange,
    onBackgroundImageRemove,
    onBackgroundScrimOpacityChange,
    onTextColorChange,
    onTextColorsReset,
    onAddCustomSearchEngine,
    onRemoveCustomSearchEngine,
    onWeatherCityChange,
    onRefreshWeather,
    onSelectWorkspace,
    onAddWorkspace,
    onDeleteWorkspace,
    onAddTodo,
    onToggleTodo,
    onDeleteTodo,
    onReorderTodo,
    onAddHabit,
    onToggleHabitToday,
    onDeleteHabit,
    onAddBookmark,
    onDeleteBookmark,
    onAddBookmarkCategory,
    onDeleteBookmarkCategory,
    onSaveNote,
  } = props;

  const [activeScreen, setActiveScreen] = useState<ScreenId>("home");

  return (
    <main className={styles.shell}>
      <div className={`glow ${styles.glowOrb}`} aria-hidden />

      <header className={styles.headerRow}>
        <TopBar locale={settings.locale} time={timeLabel} date={dateLabel} weather={weather} onRefreshWeather={onRefreshWeather} />

        <div className={styles.headerActions}>
          <ScreenMenu activeScreen={activeScreen} locale={settings.locale} onSelect={setActiveScreen} />
          <button
            type="button"
            className={screenMenuStyles.iconButton}
            onClick={() => void onThemeToggle(theme === "dark" ? "light" : "dark")}
            aria-label={t(settings.locale, "toggleTheme")}
          >
            {theme === "dark" ? <Sun size={16} strokeWidth={2.25} /> : <Moon size={16} strokeWidth={2.25} />}
          </button>
        </div>
      </header>

      <div
        className={`${styles.content} ${activeScreen === "home" ? styles.contentHome : ""} ${activeScreen === "settings" ? styles.contentSettings : ""}`}
      >
        {activeScreen === "home" ? (
          <div className={styles.homeLayout}>
            <div className={styles.homeMain}>
              <div className={styles.homeMainCenter}>
                <div className={styles.homeMainStack}>
                  <SearchCore
                    locale={settings.locale}
                    activeSearchEngineId={settings.activeSearchEngineId}
                    customSearchEngines={settings.customSearchEngines}
                    onEngineChange={onActiveSearchEngineChange}
                  />
                  <QuickLinks
                    bookmarks={bookmarks}
                    categories={bookmarkCategories}
                    locale={settings.locale}
                    onAdd={onAddBookmark}
                    onDelete={onDeleteBookmark}
                    onAddCategory={onAddBookmarkCategory}
                    onDeleteCategory={onDeleteBookmarkCategory}
                  />
                </div>
              </div>
            </div>
            <aside className={styles.homeSidebar}>
              <TodayPanel todos={todos} habits={habits} locale={settings.locale} />
            </aside>
          </div>
        ) : null}

        {activeScreen === "todo" ? (
          <div className={styles.screenPanel}>
            <TodoWidget todos={todos} locale={settings.locale} onAdd={onAddTodo} onToggle={onToggleTodo} onDelete={onDeleteTodo} onReorder={onReorderTodo} />
          </div>
        ) : null}

        {activeScreen === "habits" ? (
          <div className={styles.screenPanel}>
            <Suspense fallback={<section className={`card ${styles.widgetFallback}`}>{t(settings.locale, "loadingHabits")}</section>}>
              <HabitsWidget
                habits={habits}
                locale={settings.locale}
                onAdd={onAddHabit}
                onToggleToday={onToggleHabitToday}
                onDelete={onDeleteHabit}
              />
            </Suspense>
          </div>
        ) : null}

        {activeScreen === "notes" ? (
          <div className={styles.screenPanel}>
            <Suspense fallback={<section className={`card ${styles.widgetFallback}`}>{t(settings.locale, "loadingNotes")}</section>}>
              <NotesWidget text={noteText} locale={settings.locale} onSave={onSaveNote} />
            </Suspense>
          </div>
        ) : null}

        {activeScreen === "settings" ? (
          <div className={`${styles.screenPanel} ${styles.screenPanelWide} ${styles.screenPanelSettings}`}>
            <SettingsPanel
              settings={settings}
              onTimeFormatChange={onTimeFormatChange}
              onTimezoneChange={onTimezoneChange}
              onLocaleChange={onLocaleChange}
              onDateFormatChange={onDateFormatChange}
              onTabTitleChange={onTabTitleChange}
              onBackgroundImageChange={onBackgroundImageChange}
              onBackgroundImageRemove={onBackgroundImageRemove}
              onBackgroundScrimOpacityChange={onBackgroundScrimOpacityChange}
              onTextColorChange={onTextColorChange}
              onTextColorsReset={onTextColorsReset}
              onActiveSearchEngineChange={onActiveSearchEngineChange}
              onAddCustomSearchEngine={onAddCustomSearchEngine}
              onRemoveCustomSearchEngine={onRemoveCustomSearchEngine}
              onWeatherCityChange={onWeatherCityChange}
            />
          </div>
        ) : null}
      </div>

      <footer className={styles.footerRow}>
        <WorkspaceBar
          locale={settings.locale}
          workspaces={workspaces}
          activeWorkspaceId={activeWorkspaceId}
          onSelect={id => void onSelectWorkspace(id)}
          onAdd={onAddWorkspace}
          onDelete={onDeleteWorkspace}
        />
      </footer>
    </main>
  );
});
