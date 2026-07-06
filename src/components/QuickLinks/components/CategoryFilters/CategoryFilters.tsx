import clsx from 'clsx';
import {t} from '@/i18n';
import styles from './CategoryFilters.module.scss';
import type {AppLocale, BookmarkCategory} from '@/db';

interface CategoryFiltersProps {
    activeFilter: string;
    categories: BookmarkCategory[];
    locale: AppLocale;
    onAllFilterClick: () => void;
    onCategoryDelete: (categoryId: string) => Promise<void>;
    onCategoryFilterClick: (categoryId: string) => void;
    onNewCategoryClick: () => void;
}

export function CategoryFilters({
    activeFilter,
    categories,
    locale,
    onAllFilterClick,
    onCategoryDelete,
    onCategoryFilterClick,
    onNewCategoryClick,
}: CategoryFiltersProps) {
    const allCategoryPillClassName = clsx(styles.categoryPill, {
        [styles.categoryPillActive]: activeFilter === 'all',
    });

    return (
        <div className={styles.categoryRow}>
            <button type="button" className={allCategoryPillClassName} onClick={onAllFilterClick}>
                {t(locale, 'allLinks')}
            </button>

            {categories.map(category => {
                const categoryPillClassName = clsx(styles.categoryPill, {
                    [styles.categoryPillActive]: activeFilter === category.id,
                });

                const handleCategoryFilterClick = () => {
                    onCategoryFilterClick(category.id);
                };

                const handleCategoryDeleteClick = () => {
                    void onCategoryDelete(category.id);
                };

                return (
                    <span className={styles.categoryPillWrap} key={category.id}>
                        <button
                            type="button"
                            className={categoryPillClassName}
                            onClick={handleCategoryFilterClick}
                        >
                            {category.name}
                        </button>
                        <button
                            type="button"
                            className={styles.categoryRemove}
                            onClick={handleCategoryDeleteClick}
                            aria-label={`${t(locale, 'deleteCategory')} ${category.name}`}
                        >
                            x
                        </button>
                    </span>
                );
            })}

            <button type="button" className={styles.newCategoryButton} onClick={onNewCategoryClick}>
                + {t(locale, 'newCategory')}
            </button>
        </div>
    );
}
