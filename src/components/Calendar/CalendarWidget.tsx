import { useMemo } from "react";
import { todayKey } from "@/app/utils";
import type { CalendarWidgetProps } from "@/components/Calendar/types/CalendarWidgetProps";
import styles from "./CalendarWidget.module.scss";

const WEEKDAY_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function toDateKey(year: number, month: number, day: number) {
  const monthValue = String(month + 1).padStart(2, "0");
  const dayValue = String(day).padStart(2, "0");
  return `${year}-${monthValue}-${dayValue}`;
}

export function CalendarWidget({ todos }: CalendarWidgetProps) {
  const today = todayKey();

  const { year, month, cells, dueCounts } = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const firstWeekday = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const counts = new Map<string, number>();
    for (const todo of todos) {
      if (!todo.dueDate || todo.completed) continue;
      counts.set(todo.dueDate, (counts.get(todo.dueDate) ?? 0) + 1);
    }

    const monthCells: Array<number | null> = Array.from({ length: firstWeekday }, () => null);
    for (let day = 1; day <= daysInMonth; day += 1) {
      monthCells.push(day);
    }

    return {
      year: currentYear,
      month: currentMonth,
      cells: monthCells,
      dueCounts: counts,
    };
  }, [todos]);

  const monthLabel = new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" }).format(
    new Date(year, month, 1),
  );

  return (
    <section className={`card ${styles.calendarWidget}`}>
      <header className={styles.widgetHeader}>
        <h2>Календарь</h2>
        <span className={styles.monthLabel}>{monthLabel}</span>
      </header>

      <div className={styles.weekdays}>
        {WEEKDAY_LABELS.map(label => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className={styles.grid}>
        {cells.map((day, index) => {
          if (day === null) {
            return <span key={`empty-${index}`} className={styles.emptyCell} aria-hidden />;
          }

          const dateKey = toDateKey(year, month, day);
          const dueCount = dueCounts.get(dateKey) ?? 0;
          const isToday = dateKey === today;

          return (
            <span
              key={dateKey}
              className={`${styles.dayCell} ${isToday ? styles.isToday : ""} ${dueCount > 0 ? styles.hasDue : ""}`}
            >
              <span className={styles.dayNumber}>{day}</span>
              {dueCount > 0 ? <span className={styles.dueDot} aria-label={`${dueCount} задач`} /> : null}
            </span>
          );
        })}
      </div>
    </section>
  );
}
