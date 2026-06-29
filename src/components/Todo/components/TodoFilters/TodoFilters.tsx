import {t} from '@/app';
import {Select, type SelectOption} from '@/components/Select';
import styles from './TodoFilters.module.scss';
import type {TodoDateFilter} from '../../const/todoDateFilters';
import type {TodoPriorityFilter} from '../../const/todoPriorityFilters';
import type {TodoStatusFilter} from '../../const/todoStatusFilters';
import type {AppLocale} from '@/db';

type TodoFiltersProps = {
    locale: AppLocale;
    dateFilter: TodoDateFilter;
    onDateFilterChange: (value: TodoDateFilter) => void;
    dateFilterOptions: SelectOption[];
    priorityFilter: TodoPriorityFilter;
    onPriorityFilterChange: (value: TodoPriorityFilter) => void;
    priorityFilterOptions: SelectOption[];
    statusFilter: TodoStatusFilter;
    onStatusFilterChange: (value: TodoStatusFilter) => void;
    statusFilterOptions: SelectOption[];
};

export function TodoFilters({
    locale,
    dateFilter,
    onDateFilterChange,
    dateFilterOptions,
    priorityFilter,
    onPriorityFilterChange,
    priorityFilterOptions,
    statusFilter,
    onStatusFilterChange,
    statusFilterOptions,
}: TodoFiltersProps) {
    return (
        <div className={styles.filters}>
            <div className={styles.filterControl}>
                <span className={styles.filterLabel}>{t(locale, 'todoDateFilter')}</span>
                <Select
                    className={styles.filterField}
                    value={dateFilter}
                    options={dateFilterOptions}
                    onChange={value => onDateFilterChange(value as TodoDateFilter)}
                    ariaLabel={t(locale, 'todoDateFilter')}
                />
            </div>

            <div className={styles.filterControl}>
                <span className={styles.filterLabel}>{t(locale, 'todoPriorityFilter')}</span>
                <Select
                    className={styles.filterField}
                    value={priorityFilter}
                    options={priorityFilterOptions}
                    onChange={value => onPriorityFilterChange(value as TodoPriorityFilter)}
                    ariaLabel={t(locale, 'todoPriorityFilter')}
                />
            </div>

            <div className={styles.filterControl}>
                <span className={styles.filterLabel}>{t(locale, 'todoStatusFilter')}</span>
                <Select
                    className={styles.filterField}
                    value={statusFilter}
                    options={statusFilterOptions}
                    onChange={value => onStatusFilterChange(value as TodoStatusFilter)}
                    ariaLabel={t(locale, 'todoStatusFilter')}
                />
            </div>
        </div>
    );
}
