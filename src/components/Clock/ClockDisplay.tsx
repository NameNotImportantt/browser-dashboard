import type { ClockDisplayProps } from "@/components/Clock/types/ClockDisplayProps";
import styles from "./ClockDisplay.module.scss";

export function ClockDisplay({ time, date }: ClockDisplayProps) {
  return (
    <div className={styles.clockDisplay} aria-label="Текущие дата и время">
      <strong className={styles.timeLabel}>{time}</strong>
      <span className={styles.dateLabel}>{date}</span>
    </div>
  );
}
