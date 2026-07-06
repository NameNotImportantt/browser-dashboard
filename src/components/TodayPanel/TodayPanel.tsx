import {useState} from 'react';
import clsx from 'clsx';
import {Flame, ListTodo} from 'lucide-react';
import {Loader} from '@/components';
import {Checkbox} from '@/components/Checkbox';
import {useDashboardCore, useSettings} from '@/dashboard';
import {t} from '@/i18n';
import {TodayHabitRow} from './components/TodayHabitRow/TodayHabitRow';
import {TodayTaskRow} from './components/TodayTaskRow/TodayTaskRow';
import {useTodayPanelHabits} from './hooks/useTodayPanelHabits';
import {useTodayPanelTodos} from './hooks/useTodayPanelTodos';
import styles from './TodayPanel.module.scss';

export function TodayPanel() {
    const {locale} = useSettings();
    const {deferredLoading, deferredReady} = useDashboardCore();
    const [showCompleted, setShowCompleted] = useState(false);
    const {panelTodos, toggleTodo} = useTodayPanelTodos(showCompleted);
    const {habitRows, toggleHabitToday} = useTodayPanelHabits();
    const todayPanelClassName = clsx('card', styles.todayPanel);
    const habitsSectionClassName = clsx(styles.section, styles.sectionSeparated);
    const taskToggleLabel = t(locale, 'todayTasksShowCompleted');
    const showHabitsLoading = deferredLoading && !deferredReady;

    const handleShowCompletedChange = () => {
        setShowCompleted(currentShowCompleted => !currentShowCompleted);
    };

    const handleTodoToggle = (todoId: string) => {
        void toggleTodo(todoId);
    };

    const handleHabitToggle = (habitId: string) => {
        void toggleHabitToday(habitId);
    };

    return (
        <section className={todayPanelClassName} aria-label={t(locale, 'todayTasks')}>
            <div className={styles.panelContent}>
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionTitleWrap}>
                            <ListTodo className={styles.sectionIcon} size={15} strokeWidth={2.2} />

                            <h2 className={styles.sectionTitle}>{t(locale, 'todayTasks')}</h2>
                        </div>

                        <Checkbox
                            checked={showCompleted}
                            onChange={handleShowCompletedChange}
                            className={styles.sectionToggle}
                            label={<span className={styles.sectionToggleLabel}>{taskToggleLabel}</span>}
                        />
                    </div>

                    <ul className={styles.taskList}>
                        {panelTodos.length > 0 ? (
                            panelTodos.map(todo => (
                                <TodayTaskRow
                                    key={todo.id}
                                    todo={todo}
                                    onToggle={handleTodoToggle}
                                />
                            ))
                        ) : (
                            <li className={styles.emptyItem}>{t(locale, 'todayTasksEmpty')}</li>
                        )}
                    </ul>
                </div>

                <div className={habitsSectionClassName}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionTitleWrap}>
                            <Flame className={styles.sectionIcon} size={15} strokeWidth={2.2} />

                            <h2 className={styles.sectionTitle}>{t(locale, 'habits')}</h2>
                        </div>
                    </div>

                    <ul className={styles.habitList}>
                        {showHabitsLoading ? (
                            <li className={styles.emptyItem}>
                                <Loader label={t(locale, 'loadingHabits')} tone="inline" />
                            </li>
                        ) : habitRows.length > 0 ? (
                            habitRows.map(habit => (
                                <TodayHabitRow
                                    key={habit.id}
                                    habit={habit}
                                    onToggle={handleHabitToggle}
                                />
                            ))
                        ) : (
                            <li className={styles.emptyItem}>{t(locale, 'noHabits')}</li>
                        )}
                    </ul>
                </div>
            </div>
        </section>
    );
}
