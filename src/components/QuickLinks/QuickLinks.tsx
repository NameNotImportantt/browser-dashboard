import {Fragment, type ChangeEvent} from 'react';
import clsx from 'clsx';
import {Link, RefreshCw} from 'lucide-react';
import {ActionStatus, FieldValidationMessage} from '@/components';
import {t} from '@/i18n';
import {useQuickLinksController} from './hooks/useQuickLinksController';
import styles from './QuickLinks.module.scss';

interface QuickLinksProps {
  dismissRequestId?: number;
}

export function QuickLinks({dismissRequestId = 0}: QuickLinksProps) {
    const {
        activeFilter,
        areBookmarkFaviconsEnabled,
        bookmarkTitle,
        isBookmarkTitleInvalid,
        bookmarkTitleValidation,
        bookmarkUrl,
        isBookmarkUrlInvalid,
        bookmarkUrlValidation,
        categories,
        categoryName,
        isCategoryInvalid,
        categoryValidation,
        deleteBookmark,
        faviconRefreshStatus,
        handleBookmarkFormCancel,
        handleBookmarkFormToggle,
        handleBookmarkTitleChange,
        handleBookmarkUrlChange,
        handleCategoryFormCancel,
        handleCategoryFormToggle,
        handleCategoryNameChange,
        handleDeleteCategory,
        isAddingCategory,
        isAddingLink,
        locale,
        refreshVisibleFavicons,
        setActiveFilter,
        submitCategory,
        submitLink,
        visibleBookmarks,
    } = useQuickLinksController({dismissRequestId});

    const allCategoryPillClassName = clsx(styles.categoryPill, {[styles.categoryPillActive]: activeFilter === 'all'});

    const handleAllFilterClick = () => {
        setActiveFilter('all');
    };

    const handleCategoryNameChangeEvent = (event: ChangeEvent<HTMLInputElement>) => {
        handleCategoryNameChange(event.target.value);
    };

    const handleLinkTitleChangeEvent = (event: ChangeEvent<HTMLInputElement>) => {
        handleBookmarkTitleChange(event.target.value);
    };

    const handleLinkUrlChangeEvent = (event: ChangeEvent<HTMLInputElement>) => {
        handleBookmarkUrlChange(event.target.value);
    };

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
                    onClick={handleCategoryFormToggle}
                >
                    + {t(locale, 'newCategory')}
                </button>
            </div>

            {isAddingCategory ? (
                <form className={styles.inlineForm} onSubmit={submitCategory}>
                    <div className={styles.formField}>
                        <input
                            className={clsx(styles.formInput, isCategoryInvalid && styles.formInputInvalid)}
                            value={categoryName}
                            onChange={handleCategoryNameChangeEvent}
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
                        onClick={handleCategoryFormCancel}
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
                    onClick={handleBookmarkFormToggle}
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
                            className={clsx(styles.formInput, isBookmarkTitleInvalid && styles.formInputInvalid)}
                            value={bookmarkTitle}
                            onChange={handleLinkTitleChangeEvent}
                            placeholder={t(locale, 'bookmarkTitle')}
                            aria-label={t(locale, 'bookmarkTitle')}
                            {...bookmarkTitleValidation.getAriaProps()}
                        />

                        <FieldValidationMessage
                            className={styles.formMessage}
                            id={bookmarkTitleValidation.messageId}
                            message={bookmarkTitleValidation.showError ? bookmarkTitleValidation.validation.error : null}
                        />
                    </div>

                    <div className={styles.formField}>
                        <input
                            className={clsx(styles.formInput, isBookmarkUrlInvalid && styles.formInputInvalid)}
                            value={bookmarkUrl}
                            onChange={handleLinkUrlChangeEvent}
                            placeholder={t(locale, 'bookmarkUrl')}
                            aria-label={t(locale, 'bookmarkUrl')}
                            {...bookmarkUrlValidation.getAriaProps()}
                        />

                        <FieldValidationMessage
                            className={styles.formMessage}
                            id={bookmarkUrlValidation.messageId}
                            message={bookmarkUrlValidation.showError ? bookmarkUrlValidation.validation.error : null}
                        />
                    </div>

                    <button className="primary" type="submit">
                        {t(locale, 'add')}
                    </button>

                    <button
                        type="button"
                        onClick={handleBookmarkFormCancel}
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
