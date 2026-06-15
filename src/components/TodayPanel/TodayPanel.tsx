import { useMemo } from "react";
import { AlertCircle, ArrowDown, Minus } from "lucide-react";
import { t } from "@/app/i18n";
import { getHabitStreak, todayKey } from "@/app/utils";
import type { TodoPriority } from "@/db/types/todo";
import type { TodayPanelProps } from "@/components/TodayPanel/types/TodayPanelProps";
import styles from "./TodayPanel.module.scss";

export function TodayPanel({ todos, habits, locale }: TodayPanelProps) {
  const today = todayKey();

  const activeTodos = useMemo(() => todos.filter(item => !item.completed).slice(0, 5), [todos]);

  const habitStreaks = useMemo(
    () =>
      habits.map(habit => ({
        id: habit.id,
        title: habit.title,
        streak: getHabitStreak(habit.completionDates, today),
      })),
    [habits, today],
  );

  return (
    <section className={`card ${styles.todayPanel}`} aria-label={t(locale, "todayTasks")}>
      <div className={styles.columns}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>{t(locale, "todayTasks")}</h2>
          <ul className={styles.taskList}>
            {activeTodos.length > 0 ? (
              activeTodos.map(todo => (
                <li key={todo.id} className={styles.taskItem}>
                  <PriorityIcon priority={todo.priority} locale={locale} />
                  <span>{todo.title}</span>
                </li>
              ))
            ) : (
              <li className={styles.emptyItem}>{t(locale, "noActiveTasks")}</li>
            )}
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>{t(locale, "habits")}</h2>
          <ul className={styles.habitList}>
            {habitStreaks.length > 0 ? (
              habitStreaks.map(habit => (
                <li key={habit.id} className={styles.habitItem}>
                  <span>
                    {habit.title} — {habit.streak} {t(locale, "days")}
                  </span>
                </li>
              ))
            ) : (
              <li className={styles.emptyItem}>{t(locale, "noHabits")}</li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}

function PriorityIcon({ priority, locale }: { priority: TodoPriority; locale: TodayPanelProps["locale"] }) {
  const label =
    priority === "high" ? t(locale, "priorityHigh") : priority === "low" ? t(locale, "priorityLow") : t(locale, "priorityMedium");

  if (priority === "high") {
    return (
      <span className={`${styles.priorityIcon} ${styles.priorityHigh}`} aria-label={label} title={label}>
        <AlertCircle size={14} strokeWidth={2.25} />
      </span>
    );
  }

  if (priority === "low") {
    return (
      <span className={`${styles.priorityIcon} ${styles.priorityLow}`} aria-label={label} title={label}>
        <ArrowDown size={14} strokeWidth={2.25} />
      </span>
    );
  }

  return (
    <span className={`${styles.priorityIcon} ${styles.priorityMedium}`} aria-label={label} title={label}>
      <Minus size={14} strokeWidth={2.25} />
    </span>
  );
}
