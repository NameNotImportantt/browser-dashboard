import { lazy, memo, Suspense, useState } from "react";
import { QuickLinks } from "@/components/QuickLinks/QuickLinks";
import { ScreenMenu } from "@/components/ScreenMenu/ScreenMenu";
import type { ScreenId } from "@/components/ScreenMenu/types/ScreenMenuProps";
import { SearchCore } from "@/components/SearchCore/SearchCore";
import { TodayPanel } from "@/components/TodayPanel/TodayPanel";
import { TodoWidget } from "@/components/Todo/TodoWidget";
import { TopBar } from "@/components/TopBar/TopBar";
import { WorkspaceBar } from "@/components/WorkspaceBar/WorkspaceBar";
import type { HomePageProps } from "@/pages/types/HomePageProps";
import styles from "./HomePage.module.scss";

const HabitsWidget = lazy(() => import("@/components/Habits/HabitsWidget").then(module => ({ default: module.HabitsWidget })));
const NotesWidget = lazy(() => import("@/components/Notes/NotesWidget").then(module => ({ default: module.NotesWidget })));

export const HomePage = memo(function HomePage(props: HomePageProps) {
  const {
    timeLabel,
    dateLabel,
    theme,
    searchEngine,
    weather,
    workspaces,
    activeWorkspaceId,
    todos,
    habits,
    bookmarks,
    noteText,
    onThemeToggle,
    onSearchEngineChange,
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
    onSaveNote,
  } = props;

  const [activeScreen, setActiveScreen] = useState<ScreenId>("home");

  return (
    <main className={styles.shell}>
      <div className={`glow ${styles.glowOrb}`} aria-hidden />

      <header className={styles.headerRow}>
        <TopBar time={timeLabel} date={dateLabel} weather={weather} onRefreshWeather={onRefreshWeather} />

        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.themeToggle}
            onClick={() => void onThemeToggle(theme === "dark" ? "light" : "dark")}
            aria-label="Переключить тему"
          >
            {theme === "dark" ? "◐" : "◑"}
          </button>
          <ScreenMenu activeScreen={activeScreen} onSelect={setActiveScreen} />
        </div>
      </header>

      <div className={styles.content}>
        {activeScreen === "home" ? (
          <div className={styles.homeStack}>
            <SearchCore engine={searchEngine} onEngineChange={onSearchEngineChange} />
            <QuickLinks bookmarks={bookmarks} onAdd={onAddBookmark} onDelete={onDeleteBookmark} />
            <TodayPanel todos={todos} habits={habits} />
          </div>
        ) : null}

        {activeScreen === "todo" ? (
          <div className={styles.screenPanel}>
            <TodoWidget todos={todos} onAdd={onAddTodo} onToggle={onToggleTodo} onDelete={onDeleteTodo} onReorder={onReorderTodo} />
          </div>
        ) : null}

        {activeScreen === "habits" ? (
          <div className={styles.screenPanel}>
            <Suspense fallback={<section className={`card ${styles.widgetFallback}`}>Загрузка привычек...</section>}>
              <HabitsWidget habits={habits} onAdd={onAddHabit} onToggleToday={onToggleHabitToday} onDelete={onDeleteHabit} />
            </Suspense>
          </div>
        ) : null}

        {activeScreen === "notes" ? (
          <div className={styles.screenPanel}>
            <Suspense fallback={<section className={`card ${styles.widgetFallback}`}>Загрузка заметок...</section>}>
              <NotesWidget text={noteText} onSave={onSaveNote} />
            </Suspense>
          </div>
        ) : null}
      </div>

      <footer className={styles.footerRow}>
        <WorkspaceBar
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
