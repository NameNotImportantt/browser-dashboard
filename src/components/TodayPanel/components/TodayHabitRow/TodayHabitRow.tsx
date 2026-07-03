import clsx from 'clsx';
import {Flame} from 'lucide-react';
import {Checkbox} from '@/components/Checkbox';
import {useSettings} from '@/dashboard';
import {t} from '@/i18n';
import styles from './TodayHabitRow.module.scss';
import type {TodayPanelHabitItem} from '../../hooks/useTodayPanelHabits';
import type {AppLocale} from '@/db';

type TodayHabitRowProps = {
    habit: TodayPanelHabitItem;
    onToggle: (habitId: string) => void;
};

export function TodayHabitRow({habit, onToggle}: TodayHabitRowProps) {
    const {locale} = useSettings();

    const rowSurfaceClassName = clsx(
        styles.habitRowSurface,
        habit.completedToday && styles.habitRowSurfaceCompleted,
    );
    const checkboxLabel = (
        <span className={styles.visuallyHidden}>
            {getHabitCheckboxLabel(habit.completedToday, habit.title, locale)}
        </span>
    );

    const handleToggle = () => {
        onToggle(habit.id);
    };

    return (
        <li className={styles.habitRow}>
            <div className={rowSurfaceClassName}>
                <Checkbox
                    checked={habit.completedToday}
                    onChange={handleToggle}
                    className={styles.habitCheckbox}
                    label={checkboxLabel}
                />

                <div className={styles.rowBody}>
                    <span className={styles.rowTitle}>{habit.title}</span>
                </div>

                <div className={styles.rowMeta}>
                    <span className={styles.streakBadge}>
                        <Flame size={13} strokeWidth={2.2} />

                        <span>
                            {habit.streak} {t(locale, 'days')}
                        </span>
                    </span>
                </div>
            </div>
        </li>
    );
}

function getHabitCheckboxLabel(completedToday: boolean, title: string, locale: AppLocale) {
    const actionLabel = completedToday ? t(locale, 'habitUnmarkToday') : t(locale, 'habitMarkToday');

    return `${actionLabel}: ${title}`;
}
