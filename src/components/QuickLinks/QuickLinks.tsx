import {Fragment, useEffect, useMemo, useState, type ChangeEvent, type FormEvent} from 'react';
import clsx from 'clsx';
import {Link, RefreshCw} from 'lucide-react';
import {ActionStatus, FieldValidationMessage, fieldValidationStyles, useFieldValidation} from '@/components';
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
    const faviconRefreshStatus = useActionStatus();
    const linkTitleValidation = useFieldValidation();
    const linkUrlValidation = useFieldValidation();
    const categoryValidation = useFieldValidation();

    const visibleBookmarks = useMemo(() => {
        if (activeFilter === 'all') {return bookmarks;}

        return bookmarks.filter(item => item.categoryId === activeFilter);
    }, [activeFilter, bookmarks]);

    const activeCategoryId = activeFilter === 'all' ? null : activeFilter;
    const allCategoryPillClassName = clsx(styles.categoryPill, {[styles.categoryPillActive]: activeFilter === 'all'});
    const linkTitleInputClassName = clsx(styles.formInput, linkTitleValidation.isInvalid && fieldValidationStyles.fieldControlInvalid);
    const linkUrlInputClassName = clsx(styles.formInput, linkUrlValidation.isInvalid && fieldValidationStyles.fieldControlInvalid);
    const categoryInputClassName = clsx(styles.formInput, categoryValidation.isInvalid && fieldValidationStyles.fieldControlInvalid);

    const resetLinkForm = () => {
        setTitle('');
        setUrl('');
        linkTitleValidation.reset();
        linkUrlValidation.reset();
    };

    const closeLinkForm = () => {
        setIsAddingLink(false);
        resetLinkForm();
    };

    const resetCategoryForm = () => {
        setCategoryName('');
        categoryValidation.reset();
    };

    const closeCategoryForm = () => {
        setIsAddingCategory(false);
        resetCategoryForm();
    };

    const handleAllFilterClick = () => {
        setActiveFilter('all');
    };

    const handleCategoryToggleClick = () => {
        setIsAddingCategory(currentValue => !currentValue);
        setIsAddingLink(false);
        resetLinkForm();

        if (isAddingCategory) {
            resetCategoryForm();
            return;
        }

        categoryValidation.reset();
    };

    const handleLinkToggleClick = () => {
        setIsAddingLink(currentValue => !currentValue);
        setIsAddingCategory(false);
        resetCategoryForm();

        if (isAddingLink) {
            resetLinkForm();
            return;
        }

        linkTitleValidation.reset();
        linkUrlValidation.reset();
    };

    const handleLinkTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
        linkTitleValidation.clearError();
    };

    const handleLinkUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUrl(event.target.value);
        linkUrlValidation.clearError();
    };

    const handleCategoryNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCategoryName(event.target.value);
        categoryValidation.clearError();
    };

    const submitLink = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedTitle = title.trim();
        const trimmedUrl = url.trim();
        let hasError = false;

        if (!trimmedTitle) {
            linkTitleValidation.markSubmitted();
            linkTitleValidation.setError(t(locale, 'bookmarkTitleRequired'));
            hasError = true;
        } else {
            linkTitleValidation.clearError();
        }

        if (!trimmedUrl) {
            linkUrlValidation.markSubmitted();
            linkUrlValidation.setError(t(locale, 'bookmarkUrlRequired'));
            hasError = true;
        } else if (!normalizeUrl(trimmedUrl)) {
            linkUrlValidation.markSubmitted();
            linkUrlValidation.setError(t(locale, 'bookmarkUrlInvalid'));
            hasError = true;
        } else {
            linkUrlValidation.clearError();
        }

        if (hasError) {
            return;
        }

        await addBookmark({title: trimmedTitle, url: trimmedUrl, categoryId: activeCategoryId});
        closeLinkForm();
    };

    const submitCategory = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedCategoryName = categoryName.trim();

        if (!trimmedCategoryName) {
            categoryValidation.markSubmitted();
            categoryValidation.setError(t(locale, 'categoryNameRequired'));
            return;
        }

        await addBookmarkCategory({name: trimmedCategoryName});
        closeCategoryForm();
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
        resetLinkForm();
        resetCategoryForm();
        faviconRefreshStatus.reset();
    }, [dismissRequestId]);

    return (
        <section className={styles.quickLinks} aria-label={t(locale, 'savedLinks')}>
            <div className={styles.categoryRow}>
                <button
                    type="button"
                    className={allCategoryPillClassName}
                    onClick={handleAllFilterClick}
                >
                    {t(locale, 'allLinks')}
                </button>

                {categories.map(category => {
                    const categoryPillClassName = clsx(styles.categoryPill, {[styles.categoryPillActive]: activeFilter === category.id});

                    const handleCategoryFilterClick = () => {
                        setActiveFilter(category.id);
                    };
                    const handleCategoryDeleteClick = () => {
                        void handleDeleteCategory(category.id);
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
                                ×
                            </button>
                        </span>
                    );
                })}

                <button
                    type="button"
                    className={styles.newCategoryButton}
                    onClick={handleCategoryToggleClick}
                >
                    + {t(locale, 'newCategory')}
                </button>
            </div>

            {isAddingCategory ? (
                <form className={styles.inlineForm} onSubmit={submitCategory}>
                    <div className={styles.formField}>
                        <input
                            className={categoryInputClassName}
                            value={categoryName}
                            onChange={handleCategoryNameChange}
                            placeholder={t(locale, 'categoryName')}
                            aria-label={t(locale, 'categoryName')}
                            {...categoryValidation.getAriaProps()}
                            autoFocus
                        />

                        <FieldValidationMessage
                            className={styles.formMessage}
                            id={categoryValidation.messageId}
                            message={categoryValidation.showError ? categoryValidation.validation.error : null}
                        />
                    </div>

                    <button className="primary" type="submit">
                        {t(locale, 'add')}
                    </button>

                    <button
                        type="button"
                        onClick={closeCategoryForm}
                    >
                        {t(locale, 'cancel')}
                    </button>
                </form>
            ) : null}

            <div className={styles.linksRow}>
                {visibleBookmarks.map((bookmark, index) => (
                    <QuickLinkItem
                        key={bookmark.id}
                        areBookmarkFaviconsEnabled={areBookmarkFaviconsEnabled}
                        bookmark={bookmark}
                        index={index}
                        locale={locale}
                        onDelete={deleteBookmark}
                    />
                ))}

                <button
                    type="button"
                    className={styles.addButton}
                    onClick={handleLinkToggleClick}
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
                    <div className={styles.formField}>
                        <input
                            className={linkTitleInputClassName}
                            value={title}
                            onChange={handleLinkTitleChange}
                            placeholder={t(locale, 'bookmarkTitle')}
                            aria-label={t(locale, 'bookmarkTitle')}
                            {...linkTitleValidation.getAriaProps()}
                        />

                        <FieldValidationMessage
                            className={styles.formMessage}
                            id={linkTitleValidation.messageId}
                            message={linkTitleValidation.showError ? linkTitleValidation.validation.error : null}
                        />
                    </div>

                    <div className={styles.formField}>
                        <input
                            className={linkUrlInputClassName}
                            value={url}
                            onChange={handleLinkUrlChange}
                            placeholder={t(locale, 'bookmarkUrl')}
                            aria-label={t(locale, 'bookmarkUrl')}
                            {...linkUrlValidation.getAriaProps()}
                        />

                        <FieldValidationMessage
                            className={styles.formMessage}
                            id={linkUrlValidation.messageId}
                            message={linkUrlValidation.showError ? linkUrlValidation.validation.error : null}
                        />
                    </div>

                    <button className="primary" type="submit">
                        {t(locale, 'add')}
                    </button>

                    <button
                        type="button"
                        onClick={closeLinkForm}
                    >
                        {t(locale, 'cancel')}
                    </button>
                </form>
            ) : null}
        </section>
    );
}

interface QuickLinkItemProps {
    areBookmarkFaviconsEnabled: boolean;
    bookmark: {
        faviconUrl: string | null;
        id: string;
        title: string;
        url: string;
    };
    index: number;
    locale: 'ru' | 'en';
    onDelete: (bookmarkId: string) => Promise<void>;
}

function QuickLinkItem({areBookmarkFaviconsEnabled, bookmark, index, locale, onDelete}: QuickLinkItemProps) {
    const handleDeleteClick = () => {
        void onDelete(bookmark.id);
    };

    return (
        <Fragment>
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
                    onClick={handleDeleteClick}
                    aria-label={`${t(locale, 'remove')} ${bookmark.title}`}
                >
                    ×
                </button>
            </span>
        </Fragment>
    );
}
