import {useMemo, useState, type FormEvent} from 'react';
import {t} from '@/app';
import {useBookmarks, useSettings} from '@/dashboard';
import styles from './QuickLinks.module.scss';

type CategoryFilter = 'all' | string;

export function QuickLinks() {
    const {bookmarks, categories, addBookmark, deleteBookmark, addBookmarkCategory, deleteBookmarkCategory} = useBookmarks();
    const {locale} = useSettings();
    const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
    const [isAddingLink, setIsAddingLink] = useState(false);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [categoryName, setCategoryName] = useState('');

    const visibleBookmarks = useMemo(() => {
        if (activeFilter === 'all') {return bookmarks;}

        return bookmarks.filter(item => item.categoryId === activeFilter);
    }, [activeFilter, bookmarks]);

    const activeCategoryId = activeFilter === 'all' ? null : activeFilter;

    const submitLink = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await addBookmark({title, url, categoryId: activeCategoryId});
        setTitle('');
        setUrl('');
        setIsAddingLink(false);
    };

    const submitCategory = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await addBookmarkCategory({name: categoryName});
        setCategoryName('');
        setIsAddingCategory(false);
    };

    const handleDeleteCategory = async (categoryId: string) => {
        await deleteBookmarkCategory(categoryId);

        if (activeFilter === categoryId) {
            setActiveFilter('all');
        }
    };

    return (
        <section className={styles.quickLinks} aria-label={t(locale, 'savedLinks')}>
            <div className={styles.categoryRow}>
                <button
                    type="button"
                    className={`${styles.categoryPill} ${activeFilter === 'all' ? styles.categoryPillActive : ''}`}
                    onClick={() => setActiveFilter('all')}
                >
                    {t(locale, 'allLinks')}
                </button>

                {categories.map(category => (
                    <span className={styles.categoryPillWrap} key={category.id}>
                        <button
                            type="button"
                            className={`${styles.categoryPill} ${activeFilter === category.id ? styles.categoryPillActive : ''}`}
                            onClick={() => setActiveFilter(category.id)}
                        >
                            {category.name}
                        </button>
                        <button
                            type="button"
                            className={styles.categoryRemove}
                            onClick={() => void handleDeleteCategory(category.id)}
                            aria-label={`${t(locale, 'deleteCategory')} ${category.name}`}
                        >
                            ×
                        </button>
                    </span>
                ))}

                <button
                    type="button"
                    className={styles.newCategoryButton}
                    onClick={() => {
                        setIsAddingCategory(value => !value);
                        setIsAddingLink(false);
                    }}
                >
                    + {t(locale, 'newCategory')}
                </button>
            </div>

            {isAddingCategory ? (
                <form className={styles.inlineForm} onSubmit={submitCategory}>
                    <input
                        value={categoryName}
                        onChange={event => setCategoryName(event.target.value)}
                        placeholder={t(locale, 'categoryName')}
                        required
                        autoFocus
                    />
                    <button className="primary" type="submit">
                        {t(locale, 'add')}
                    </button>
                    <button type="button" onClick={() => setIsAddingCategory(false)}>
                        {t(locale, 'cancel')}
                    </button>
                </form>
            ) : null}

            <div className={styles.linksRow}>
                {visibleBookmarks.map((bookmark, index) => (
                    <span className={styles.linkItem} key={bookmark.id}>
                        {index > 0 ? (
                            <span className={styles.separator} aria-hidden>
                                ·
                            </span>
                        ) : null}
                        <a href={bookmark.url} target="_blank" rel="noreferrer">
                            {bookmark.title}
                        </a>
                        <button
                            type="button"
                            className={styles.removeButton}
                            onClick={() => void deleteBookmark(bookmark.id)}
                            aria-label={`${t(locale, 'remove')} ${bookmark.title}`}
                        >
                            ×
                        </button>
                    </span>
                ))}

                <button
                    type="button"
                    className={styles.addButton}
                    onClick={() => {
                        setIsAddingLink(value => !value);
                        setIsAddingCategory(false);
                    }}
                >
                    + {t(locale, 'addLink')}
                </button>
            </div>

            {isAddingLink ? (
                <form className={styles.addForm} onSubmit={submitLink}>
                    <input
                        value={title}
                        onChange={event => setTitle(event.target.value)}
                        placeholder={t(locale, 'bookmarkTitle')}
                        required
                    />
                    <input value={url} onChange={event => setUrl(event.target.value)} placeholder={t(locale, 'bookmarkUrl')} required />
                    <button className="primary" type="submit">
                        {t(locale, 'add')}
                    </button>
                    <button type="button" onClick={() => setIsAddingLink(false)}>
                        {t(locale, 'cancel')}
                    </button>
                </form>
            ) : null}
        </section>
    );
}
