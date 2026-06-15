import { useMemo } from "react";
import { todayKey } from "@/app/utils";
import type { TodayPanelProps } from "@/components/TodayPanel/types/TodayPanelProps";
import styles from "./TodayPanel.module.scss";

export function TodayPanel({ todos, habits }: TodayPanelProps) {
  const today = todayKey();

  const activeTodos = useMemo(() => todos.filter(item => !item.completed).slice(0, 5), [todos]);

  const habitStreaks = useMemo(
    () =>
      [...habits]
        .sort((a, b) => a.position - b.position)
        .map(habit => ({
          id: habit.id,
          title: habit.title,
          streak: getCurrentStreak(habit.completionDates, today),
        })),
    [habits, today],
  );

  return (
    <section className={`card ${styles.todayPanel}`} aria-label="Сегодня">
      <div className={styles.columns}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Today</h2>
          <ul className={styles.taskList}>
            {activeTodos.length > 0 ? (
              activeTodos.map(todo => (
                <li key={todo.id} className={styles.taskItem}>
                  {todo.title}
                </li>
              ))
            ) : (
              <li className={styles.emptyItem}>Нет активных задач</li>
            )}
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Habits</h2>
          <ul className={styles.habitList}>
            {habitStreaks.length > 0 ? (
              habitStreaks.map(habit => (
                <li key={habit.id} className={styles.habitItem}>
                  <span aria-hidden>🔥</span>
                  <span>
                    {habit.title} — {habit.streak} дн.
                  </span>
                </li>
              ))
            ) : (
              <li className={styles.emptyItem}>Нет привычек</li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}

function getCurrentStreak(completionDates: string[], today: string) {
  if (completionDates.length === 0) return 0;

  const completionSet = new Set(completionDates);
  let streak = 0;
  const cursor = new Date(`${today}T00:00:00`);

  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (!completionSet.has(key)) {
      break;
    }
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
