import { useMemo, useState, type FormEvent } from "react";
import { todayKey } from "@/app/utils";
import type { HabitsWidgetProps } from "@/components/Habits/types/HabitsWidgetProps";
import styles from "./HabitsWidget.module.scss";

export function HabitsWidget({ habits, onAdd, onToggleToday, onDelete }: HabitsWidgetProps) {
  const [title, setTitle] = useState("");
  const today = todayKey();

  const enrichedHabits = useMemo(
    () =>
      habits.map(habit => ({
        ...habit,
        completedToday: habit.completionDates.includes(today),
        streak: getCurrentStreak(habit.completionDates),
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
        <h2>Привычки</h2>
      </header>

      <form className={styles.inlineForm} onSubmit={submit}>
        <input className={styles.inputField} value={title} onChange={event => setTitle(event.target.value)} placeholder="Новая привычка" required />
        <button className="primary" type="submit">
          Добавить
        </button>
      </form>

      <ul className={styles.widgetList}>
        {enrichedHabits.map(habit => (
          <li className={styles.habitItem} key={habit.id}>
            <div className={styles.habitInfo}>
              <strong>{habit.title}</strong>
              <small>Серия: {habit.streak} дн.</small>
            </div>
            <div className={styles.inlineRow}>
              <button type="button" onClick={() => void onToggleToday(habit.id)}>
                {habit.completedToday ? "Снять сегодня" : "Отметить сегодня"}
              </button>
              <button type="button" className={styles.dangerButton} onClick={() => void onDelete(habit.id)}>
                Удалить
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function getCurrentStreak(completionDates: string[]) {
  if (completionDates.length === 0) return 0;

  const completionSet = new Set(completionDates);
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

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
