import {useState, type FormEvent} from 'react';
import clsx from 'clsx';
import {t, todayKey} from '@/app';
import {useHabits, useSettings} from '@/dashboard';
import styles from './HabitsWidget.module.scss';
import {useHabitAnalytics} from './hooks/useHabitAnalytics';

export function HabitsWidget() {
    const {habits, addHabit, toggleHabitToday, deleteHabit} = useHabits();
    const {locale} = useSettings();
    const [title, setTitle] = useState('');
    const today = todayKey();
    const habitsWidgetClassName = clsx('card', styles.habitsWidget);
    const enrichedHabits = useHabitAnalytics(habits, today);

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await addHabit(title);
        setTitle('');
    };

    return (
        <section className={habitsWidgetClassName}>
            <header className={styles.widgetHeader}>
                <h2>{t(locale, 'navHabits')}</h2>
            </header>

            <form className={styles.inlineForm} onSubmit={submit}>
                <input
                    className={styles.inputField}
                    value={title}
                    onChange={event => setTitle(event.target.value)}
                    placeholder={t(locale, 'habitNewPlaceholder')}
                    required
                />
                <button className="primary" type="submit">
                    {t(locale, 'add')}
                </button>
            </form>

            <ul className={styles.widgetList}>
                {enrichedHabits.map(habit => (
                    <li className={styles.habitItem} key={habit.id}>
                        <div className={styles.habitInfo}>
                            <strong>{habit.title}</strong>

                            <small className={styles.habitMeta}>
                                {t(locale, 'habitStreakLabel')} {habit.analytics.currentStreak} {t(locale, 'days')}
                            </small>
                        </div>

                        <div className={styles.inlineRow}>
                            <button type="button" onClick={() => void toggleHabitToday(habit.id)}>
                                {habit.analytics.completedToday ? t(locale, 'habitUnmarkToday') : t(locale, 'habitMarkToday')}
                            </button>

                            <button type="button" className={styles.dangerButton} onClick={() => void deleteHabit(habit.id)}>
                                {t(locale, 'remove')}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}
