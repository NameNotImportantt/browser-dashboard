import {useEffect, useMemo, useState, type FormEvent} from 'react';
import {useFieldValidation} from '@/components';
import {useBookmarks, useSettings} from '@/dashboard';
import {normalizeUrl} from '@/data/bookmarks';
import {useActionStatus} from '@/hooks/useActionStatus';
import {t} from '@/i18n';

type CategoryFilter = 'all' | string;

interface UseQuickLinksControllerOptions {
    dismissRequestId: number;
}

export function useQuickLinksController({dismissRequestId}: UseQuickLinksControllerOptions) {
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
    const [bookmarkTitle, setBookmarkTitle] = useState('');
    const [bookmarkUrl, setBookmarkUrl] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const faviconRefreshStatus = useActionStatus();
    const bookmarkTitleValidation = useFieldValidation();
    const bookmarkUrlValidation = useFieldValidation();
    const categoryValidation = useFieldValidation();

    const visibleBookmarks = useMemo(() => {
        if (activeFilter === 'all') {
            return bookmarks;
        }

        return bookmarks.filter(bookmark => bookmark.categoryId === activeFilter);
    }, [activeFilter, bookmarks]);

    const activeCategoryId = activeFilter === 'all' ? null : activeFilter;
    const areBookmarkFaviconsEnabled = settings.bookmarkFaviconsEnabled;

    useEffect(() => {
        setIsAddingLink(false);
        setIsAddingCategory(false);
        setBookmarkTitle('');
        setBookmarkUrl('');
        setCategoryName('');
        bookmarkTitleValidation.reset();
        bookmarkUrlValidation.reset();
        categoryValidation.reset();
        faviconRefreshStatus.reset();
    }, [dismissRequestId]);

    useEffect(() => {
        if (faviconRefreshStatus.status !== 'success') {
            return;
        }

        const resetTimeoutId = window.setTimeout(() => {
            faviconRefreshStatus.reset();
        }, 2000);

        return () => {
            window.clearTimeout(resetTimeoutId);
        };
    }, [faviconRefreshStatus.reset, faviconRefreshStatus.status]);

    const handleBookmarkTitleChange = (nextValue: string) => {
        setBookmarkTitle(nextValue);
        bookmarkTitleValidation.clearError();
    };

    const handleBookmarkUrlChange = (nextValue: string) => {
        setBookmarkUrl(nextValue);
        bookmarkUrlValidation.clearError();
    };

    const handleCategoryNameChange = (nextValue: string) => {
        setCategoryName(nextValue);
        categoryValidation.clearError();
    };

    const handleCategoryFormToggle = () => {
        setIsAddingCategory(currentValue => !currentValue);
        setIsAddingLink(false);
        setBookmarkTitle('');
        setBookmarkUrl('');
        bookmarkTitleValidation.reset();
        bookmarkUrlValidation.reset();

        if (isAddingCategory) {
            setCategoryName('');
            categoryValidation.reset();
            return;
        }

        categoryValidation.reset();
    };

    const handleBookmarkFormToggle = () => {
        setIsAddingLink(currentValue => !currentValue);
        setIsAddingCategory(false);

        setCategoryName('');
        categoryValidation.reset();

        if (isAddingLink) {
            setBookmarkTitle('');
            setBookmarkUrl('');
            bookmarkTitleValidation.reset();
            bookmarkUrlValidation.reset();
            return;
        }

        bookmarkTitleValidation.reset();
        bookmarkUrlValidation.reset();
    };

    const handleCategoryFormCancel = () => {
        setIsAddingCategory(false);
        setCategoryName('');
        categoryValidation.reset();
    };

    const handleBookmarkFormCancel = () => {
        setIsAddingLink(false);
        setBookmarkTitle('');
        setBookmarkUrl('');
        bookmarkTitleValidation.reset();
        bookmarkUrlValidation.reset();
    };

    const submitLink = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedTitle = bookmarkTitle.trim();
        const trimmedUrl = bookmarkUrl.trim();
        let hasError = false;

        if (!trimmedTitle) {
            bookmarkTitleValidation.markSubmitted();
            bookmarkTitleValidation.setError(t(locale, 'bookmarkTitleRequired'));
            hasError = true;
        } else {
            bookmarkTitleValidation.clearError();
        }

        if (!trimmedUrl) {
            bookmarkUrlValidation.markSubmitted();
            bookmarkUrlValidation.setError(t(locale, 'bookmarkUrlRequired'));
            hasError = true;
        } else if (!normalizeUrl(trimmedUrl)) {
            bookmarkUrlValidation.markSubmitted();
            bookmarkUrlValidation.setError(t(locale, 'bookmarkUrlInvalid'));
            hasError = true;
        } else {
            bookmarkUrlValidation.clearError();
        }

        if (hasError) {
            return;
        }

        await addBookmark({title: bookmarkTitle, url: bookmarkUrl, categoryId: activeCategoryId});
        setBookmarkTitle('');
        setBookmarkUrl('');
        bookmarkTitleValidation.reset();
        bookmarkUrlValidation.reset();
        setIsAddingLink(false);
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
        setCategoryName('');
        categoryValidation.reset();
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

    return {
        activeFilter,
        areBookmarkFaviconsEnabled,
        bookmarkTitle,
        isBookmarkTitleInvalid: bookmarkTitleValidation.isInvalid,
        bookmarkTitleValidation,
        bookmarkUrl,
        isBookmarkUrlInvalid: bookmarkUrlValidation.isInvalid,
        bookmarkUrlValidation,
        categories,
        categoryName,
        isCategoryInvalid: categoryValidation.isInvalid,
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
    };
}
