import {type ChangeEvent, type FormEvent} from 'react';
import clsx from 'clsx';
import {RefreshCw} from 'lucide-react';
import {ActionStatus, FieldValidationMessage, fieldValidationStyles} from '@/components';
import {t} from '@/i18n';
import {CategoryFilters} from './components/CategoryFilters/CategoryFilters';
import {QuickLinkItem} from './components/QuickLinkItem/QuickLinkItem';
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
        bookmarkUrl,
        categories,
        categoryName,
        categoryValidation,
        closeCategoryForm,
        closeLinkForm,
        deleteBookmark,
        faviconRefreshStatus,
        handleAllFilterClick,
        handleBookmarkFormToggle,
        handleBookmarkTitleChange,
        handleBookmarkUrlChange,
        handleCategoryFilterClick,
        handleCategoryFormToggle,
        handleCategoryNameChange,
        handleDeleteCategory,
        isAddingCategory,
        isAddingLink,
        linkTitleValidation,
        linkUrlValidation,
        locale,
        refreshVisibleFavicons,
        submitCategory,
        submitLink,
        visibleBookmarks,
    } = useQuickLinksController({dismissRequestId});

    const categoryInputClassName = clsx(
        styles.formInput,
        categoryValidation.isInvalid && fieldValidationStyles.fieldControlInvalid,
    );
    const linkTitleInputClassName = clsx(
        styles.formInput,
        linkTitleValidation.isInvalid && fieldValidationStyles.fieldControlInvalid,
    );
    const linkUrlInputClassName = clsx(
        styles.formInput,
        linkUrlValidation.isInvalid && fieldValidationStyles.fieldControlInvalid,
    );

    const handleCategoryNameInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        handleCategoryNameChange(event.target.value);
    };

    const handleBookmarkTitleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        handleBookmarkTitleChange(event.target.value);
    };

    const handleBookmarkUrlInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        handleBookmarkUrlChange(event.target.value);
    };

    const handleCategoryFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        void submitCategory();
    };

    const handleLinkFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        void submitLink();
    };

    const handleRefreshVisibleFaviconsClick = () => {
        void refreshVisibleFavicons();
    };

    return (
        <section className={styles.quickLinks} aria-label={t(locale, 'savedLinks')}>
            <CategoryFilters
                activeFilter={activeFilter}
                categories={categories}
                locale={locale}
                onAllFilterClick={handleAllFilterClick}
                onCategoryDelete={handleDeleteCategory}
                onCategoryFilterClick={handleCategoryFilterClick}
                onNewCategoryClick={handleCategoryFormToggle}
            />

            {isAddingCategory ? (
                <form className={styles.inlineForm} onSubmit={handleCategoryFormSubmit}>
                    <div className={styles.formField}>
                        <input
                            className={categoryInputClassName}
                            value={categoryName}
                            onChange={handleCategoryNameInputChange}
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

                    <button type="button" onClick={closeCategoryForm}>
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
                        locale={locale}
                        onDelete={deleteBookmark}
                        showSeparator={index > 0}
                    />
                ))}

                <button type="button" className={styles.addButton} onClick={handleBookmarkFormToggle}>
                    + {t(locale, 'addLink')}
                </button>

                <button
                    type="button"
                    className={styles.refreshButton}
                    onClick={handleRefreshVisibleFaviconsClick}
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
                <form className={styles.addForm} onSubmit={handleLinkFormSubmit}>
                    <div className={styles.formField}>
                        <input
                            className={linkTitleInputClassName}
                            value={bookmarkTitle}
                            onChange={handleBookmarkTitleInputChange}
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
                            value={bookmarkUrl}
                            onChange={handleBookmarkUrlInputChange}
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

                    <button type="button" onClick={closeLinkForm}>
                        {t(locale, 'cancel')}
                    </button>
                </form>
            ) : null}
        </section>
    );
}
