import {useEffect, useMemo, useState, type FormEvent} from 'react';
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
    const [bookmarkError, setBookmarkError] = useState<string | null>(null);
    const faviconRefreshStatus = useActionStatus();

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
        setBookmarkError(null);
        faviconRefreshStatus.reset();
    }, [dismissRequestId]);

    const handleBookmarkTitleChange = (nextValue: string) => {
        setBookmarkTitle(nextValue);
        setBookmarkError(null);
    };

    const handleBookmarkUrlChange = (nextValue: string) => {
        setBookmarkUrl(nextValue);
        setBookmarkError(null);
    };

    const handleCategoryNameChange = (nextValue: string) => {
        setCategoryName(nextValue);
    };

    const handleCategoryFormToggle = () => {
        setIsAddingCategory(currentValue => !currentValue);
        setIsAddingLink(false);
        setBookmarkError(null);
    };

    const handleBookmarkFormToggle = () => {
        setIsAddingLink(currentValue => !currentValue);
        setIsAddingCategory(false);
        setBookmarkError(null);
    };

    const handleCategoryFormCancel = () => {
        setIsAddingCategory(false);
        setCategoryName('');
    };

    const handleBookmarkFormCancel = () => {
        setIsAddingLink(false);
        setBookmarkError(null);
    };

    const submitLink = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedTitle = bookmarkTitle.trim();
        const trimmedUrl = bookmarkUrl.trim();

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

        await addBookmark({title: bookmarkTitle, url: bookmarkUrl, categoryId: activeCategoryId});
        setBookmarkTitle('');
        setBookmarkUrl('');
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

    return {
        activeFilter,
        areBookmarkFaviconsEnabled,
        bookmarkError,
        bookmarkTitle,
        bookmarkUrl,
        categories,
        categoryName,
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
