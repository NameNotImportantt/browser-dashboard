import { useMemo, useState, type FormEvent } from "react";
import { getHabitStreak, t, todayKey } from "@/app";
import type { HabitsWidgetProps } from "./types/HabitsWidgetProps";
import styles from "./HabitsWidget.module.scss";

export function HabitsWidget({ habits, locale, onAdd, onToggleToday, onDelete }: HabitsWidgetProps) {
  const [title, setTitle] = useState("");
  const today = todayKey();

  const enrichedHabits = useMemo(
    () =>
      habits.map(habit => ({
        ...habit,
        completedToday: habit.completionDates.includes(today),
        streak: getHabitStreak(habit.completionDates, today),
      })),
    [habits, today],
  );

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onAdd(title);
    setTitle("");
  };

  return (
    <section className={`card ${styles.habitsWidget}`}>
      <header className={styles.widgetHeader}>
        <h2>{t(locale, "navHabits")}</h2>
      </header>

      <form className={styles.inlineForm} onSubmit={submit}>
        <input
          className={styles.inputField}
          value={title}
          onChange={event => setTitle(event.target.value)}
          placeholder={t(locale, "habitNewPlaceholder")}
          required
        />
        <button className="primary" type="submit">
          {t(locale, "add")}
        </button>
      </form>

      <ul className={styles.widgetList}>
        {enrichedHabits.map(habit => (
          <li className={styles.habitItem} key={habit.id}>
            <div className={styles.habitInfo}>
              <strong>{habit.title}</strong>
              <small>
                {t(locale, "habitStreakLabel")} {habit.streak} {t(locale, "days")}
              </small>
            </div>
            <div className={styles.inlineRow}>
              <button type="button" onClick={() => void onToggleToday(habit.id)}>
                {habit.completedToday ? t(locale, "habitUnmarkToday") : t(locale, "habitMarkToday")}
              </button>
              <button type="button" className={styles.dangerButton} onClick={() => void onDelete(habit.id)}>
                {t(locale, "remove")}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
