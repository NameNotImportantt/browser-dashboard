import {useEffect, useState, type FormEvent} from 'react';
import clsx from 'clsx';
import {t, todayKey} from '@/app';
import {useHabits, useSettings} from '@/dashboard';
import styles from './HabitsWidget.module.scss';
import {useHabitAnalytics} from './hooks/useHabitAnalytics';

export function HabitsWidget() {
    const {habits, addHabit, toggleHabitToday, deleteHabit} = useHabits();
    const {locale} = useSettings();
    const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const today = todayKey();
    const habitsWidgetClassName = clsx('card', styles.habitsWidget);
    const enrichedHabits = useHabitAnalytics(habits, today);
    const selectedHabit = enrichedHabits.find(habit => habit.id === selectedHabitId) ?? enrichedHabits[0] ?? null;

    useEffect(() => {
        if (enrichedHabits.length === 0) {
            if (selectedHabitId !== null) {
                setSelectedHabitId(null);
            }

            return;
        }

        const hasSelectedHabit = selectedHabitId !== null
            && enrichedHabits.some(habit => habit.id === selectedHabitId);

        if (!hasSelectedHabit) {
            const [firstHabit] = enrichedHabits;

            if (firstHabit) {
                setSelectedHabitId(firstHabit.id);
            }
        }
    }, [enrichedHabits, selectedHabitId]);

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

            {enrichedHabits.length > 0 ? (
                <div className={styles.contentLayout}>
                    <ul className={styles.widgetList}>
                        {enrichedHabits.map(habit => {
                            const habitItemClassName = clsx(
                                styles.habitItem,
                                selectedHabit?.id === habit.id && styles.habitItemSelected,
                            );

                            return (
                                <li className={habitItemClassName} key={habit.id}>
                                    <button
                                        type="button"
                                        className={styles.habitSelectButton}
                                        onClick={() => setSelectedHabitId(habit.id)}
                                    >
                                        <div className={styles.habitInfo}>
                                            <strong>{habit.title}</strong>

                                            <small className={styles.habitMeta}>
                                                {t(locale, 'habitStreakLabel')} {habit.analytics.currentStreak} {t(locale, 'days')}
                                            </small>
                                        </div>
                                    </button>

                                    <div className={styles.inlineRow}>
                                        <button
                                            type="button"
                                            className={styles.actionButton}
                                            onClick={() => void toggleHabitToday(habit.id)}
                                        >
                                            {habit.analytics.completedToday ? t(locale, 'habitUnmarkToday') : t(locale, 'habitMarkToday')}
                                        </button>

                                        <button type="button" className={styles.dangerButton} onClick={() => void deleteHabit(habit.id)}>
                                            {t(locale, 'remove')}
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    {selectedHabit ? (
                        <section className={styles.detailPanel}>
                            <div className={styles.detailHeader}>
                                <h3 className={styles.detailTitle}>{selectedHabit.title}</h3>

                                {selectedHabit.completionDates.length === 0 ? (
                                    <p className={styles.detailEmpty}>{t(locale, 'habitNoCompletionData')}</p>
                                ) : null}
                            </div>

                            <dl className={styles.statsGrid}>
                                <div className={styles.statCard}>
                                    <dt className={styles.statLabel}>{t(locale, 'habitCurrentStreakLabel')}</dt>
                                    <dd className={styles.statValue}>
                                        {selectedHabit.analytics.currentStreak} {t(locale, 'days')}
                                    </dd>
                                </div>

                                <div className={styles.statCard}>
                                    <dt className={styles.statLabel}>{t(locale, 'habitBestStreakLabel')}</dt>
                                    <dd className={styles.statValue}>
                                        {selectedHabit.analytics.bestStreak} {t(locale, 'days')}
                                    </dd>
                                </div>

                                <div className={styles.statCard}>
                                    <dt className={styles.statLabel}>{t(locale, 'habitCompletionRate30dLabel')}</dt>
                                    <dd className={styles.statValue}>{selectedHabit.analytics.completionRate30d}%</dd>
                                </div>
                            </dl>
                        </section>
                    ) : null}
                </div>
            ) : (
                <p className={styles.emptyState}>{t(locale, 'noHabits')}</p>
            )}
        </section>
    );
}
