import {Fragment, useEffect, useMemo, useState, type FormEvent} from 'react';
import clsx from 'clsx';
import {Link, RefreshCw} from 'lucide-react';
import {ActionStatus} from '@/components';
import {useBookmarks, useSettings} from '@/dashboard';
import {normalizeUrl} from '@/data/bookmarks';
import {useActionStatus} from '@/hooks/useActionStatus';
import {t} from '@/i18n';
import styles from './QuickLinks.module.scss';

type CategoryFilter = 'all' | string;

interface QuickLinksProps {
  dismissRequestId?: number;
}

export function QuickLinks({dismissRequestId = 0}: QuickLinksProps) {
    const {
        bookmarks,
        categories,
        addBookmark,
        deleteBookmark,
        refreshBookmarkFavicons,
        addBookmarkCategory,
        deleteBookmarkCategory,
    } = useBookmarks();

    const {settings, locale} = useSettings();
    const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
    const [isAddingLink, setIsAddingLink] = useState(false);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [bookmarkError, setBookmarkError] = useState<string | null>(null);
    const faviconRefreshStatus = useActionStatus();

    const visibleBookmarks = useMemo(() => {
        if (activeFilter === 'all') {return bookmarks;}

        return bookmarks.filter(item => item.categoryId === activeFilter);
    }, [activeFilter, bookmarks]);

    const activeCategoryId = activeFilter === 'all' ? null : activeFilter;
    const allCategoryPillClassName = clsx(styles.categoryPill, {[styles.categoryPillActive]: activeFilter === 'all'});

    const submitLink = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedTitle = title.trim();
        const trimmedUrl = url.trim();

        if (!trimmedTitle) {
            setBookmarkError(t(locale, 'bookmarkTitleRequired'));
            return;
        }

        if (!trimmedUrl) {
            setBookmarkError(t(locale, 'bookmarkUrlRequired'));
            return;
        }

        if (!normalizeUrl(trimmedUrl)) {
            setBookmarkError(t(locale, 'bookmarkUrlInvalid'));
            return;
        }

        await addBookmark({title, url, categoryId: activeCategoryId});
        setTitle('');
        setUrl('');
        setBookmarkError(null);
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

    const refreshVisibleFavicons = async () => {
        faviconRefreshStatus.start();

        try {
            await refreshBookmarkFavicons(visibleBookmarks.map(bookmark => bookmark.id));
            faviconRefreshStatus.succeed(t(locale, 'bookmarkFaviconsRefreshed'));
        } catch {
            faviconRefreshStatus.fail(t(locale, 'bookmarkFaviconsRefreshFailed'));
        }
    };

    const areBookmarkFaviconsEnabled = settings.bookmarkFaviconsEnabled;

    useEffect(() => {
        setIsAddingLink(false);
        setIsAddingCategory(false);
        setBookmarkError(null);
        faviconRefreshStatus.reset();
    }, [dismissRequestId]);

    return (
        <section className={styles.quickLinks} aria-label={t(locale, 'savedLinks')}>
            <div className={styles.categoryRow}>
                <button
                    type="button"
                    className={allCategoryPillClassName}
                    onClick={() => setActiveFilter('all')}
                >
                    {t(locale, 'allLinks')}
                </button>

                {categories.map(category => {
                    const categoryPillClassName = clsx(styles.categoryPill, {[styles.categoryPillActive]: activeFilter === category.id});

                    return (
                        <span className={styles.categoryPillWrap} key={category.id}>
                            <button
                                type="button"
                                className={categoryPillClassName}
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
                    );
                })}

                <button
                    type="button"
                    className={styles.newCategoryButton}
                    onClick={() => {
                        setIsAddingCategory(value => !value);
                        setIsAddingLink(false);
                        setBookmarkError(null);
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
                    <button
                        type="button"
                        onClick={() => {
                            setIsAddingCategory(false);
                            setCategoryName('');
                        }}
                    >
                        {t(locale, 'cancel')}
                    </button>
                </form>
            ) : null}

            <div className={styles.linksRow}>
                {visibleBookmarks.map((bookmark, index) => (
                    <Fragment key={bookmark.id}>
                        {index > 0 ? (
                            <span className={styles.separator} aria-hidden>
                                ·
                            </span>
                        ) : null}
                        <span className={styles.linkItem}>
                            <a className={styles.linkAnchor} href={bookmark.url} target="_blank" rel="noopener noreferrer">
                                <span className={styles.faviconWrap} aria-hidden>
                                    {areBookmarkFaviconsEnabled && bookmark.faviconUrl ? (
                                        <img className={styles.favicon} src={bookmark.faviconUrl} alt="" loading="lazy" />
                                    ) : (
                                        <Link size={14} strokeWidth={2} />
                                    )}
                                </span>
                                {bookmark.title}
                            </a>
                            <button
                                type="button"
                                className={styles.iconButton}
                                onClick={() => void deleteBookmark(bookmark.id)}
                                aria-label={`${t(locale, 'remove')} ${bookmark.title}`}
                            >
                                ×
                            </button>
                        </span>
                    </Fragment>
                ))}

                <button
                    type="button"
                    className={styles.addButton}
                    onClick={() => {
                        setIsAddingLink(value => !value);
                        setIsAddingCategory(false);
                        setBookmarkError(null);
                    }}
                >
                    + {t(locale, 'addLink')}
                </button>

                <button
                    type="button"
                    className={styles.refreshButton}
                    onClick={() => void refreshVisibleFavicons()}
                    disabled={!areBookmarkFaviconsEnabled || visibleBookmarks.length === 0 || faviconRefreshStatus.isPending}
                    aria-label={t(locale, 'refreshBookmarkFavicons')}
                    title={t(locale, 'refreshBookmarkFavicons')}
                >
                    <RefreshCw size={14} strokeWidth={2} />
                </button>
            </div>

            <ActionStatus
                className={styles.actionStatus}
                status={faviconRefreshStatus.status}
                message={faviconRefreshStatus.message}
                pendingLabel={t(locale, 'bookmarkFaviconsRefreshing')}
            />

            {isAddingLink ? (
                <form className={styles.addForm} onSubmit={submitLink}>
                    <input
                        value={title}
                        onChange={event => {
                            setTitle(event.target.value);
                            setBookmarkError(null);
                        }}
                        placeholder={t(locale, 'bookmarkTitle')}
                    />
                    <input
                        value={url}
                        onChange={event => {
                            setUrl(event.target.value);
                            setBookmarkError(null);
                        }}
                        placeholder={t(locale, 'bookmarkUrl')}
                    />
                    <button className="primary" type="submit">
                        {t(locale, 'add')}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setIsAddingLink(false);
                            setBookmarkError(null);
                        }}
                    >
                        {t(locale, 'cancel')}
                    </button>
                </form>
            ) : null}
            {bookmarkError ? <small className={styles.formError}>{bookmarkError}</small> : null}
        </section>
    );
}
