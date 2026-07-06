import {useEffect, useMemo, useState} from 'react';
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
    const linkTitleValidation = useFieldValidation();
    const linkUrlValidation = useFieldValidation();
    const categoryValidation = useFieldValidation();

    const visibleBookmarks = useMemo(() => {
        if (activeFilter === 'all') {
            return bookmarks;
        }

        return bookmarks.filter(bookmark => bookmark.categoryId === activeFilter);
    }, [activeFilter, bookmarks]);

    const activeCategoryId = activeFilter === 'all' ? null : activeFilter;
    const areBookmarkFaviconsEnabled = settings.bookmarkFaviconsEnabled;

    const resetLinkForm = () => {
        setBookmarkTitle('');
        setBookmarkUrl('');
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

    useEffect(() => {
        setIsAddingLink(false);
        setIsAddingCategory(false);
        resetLinkForm();
        resetCategoryForm();
        faviconRefreshStatus.reset();
    }, [dismissRequestId]);

    const handleAllFilterClick = () => {
        setActiveFilter('all');
    };

    const handleCategoryFilterClick = (categoryId: string) => {
        setActiveFilter(categoryId);
    };

    const handleCategoryFormToggle = () => {
        const shouldOpen = !isAddingCategory;

        setIsAddingCategory(shouldOpen);
        setIsAddingLink(false);
        resetLinkForm();

        if (shouldOpen) {
            categoryValidation.reset();
            return;
        }

        resetCategoryForm();
    };

    const handleBookmarkFormToggle = () => {
        const shouldOpen = !isAddingLink;

        setIsAddingLink(shouldOpen);
        setIsAddingCategory(false);
        resetCategoryForm();

        if (shouldOpen) {
            linkTitleValidation.reset();
            linkUrlValidation.reset();
            return;
        }

        resetLinkForm();
    };

    const handleBookmarkTitleChange = (nextValue: string) => {
        setBookmarkTitle(nextValue);
        linkTitleValidation.clearError();
    };

    const handleBookmarkUrlChange = (nextValue: string) => {
        setBookmarkUrl(nextValue);
        linkUrlValidation.clearError();
    };

    const handleCategoryNameChange = (nextValue: string) => {
        setCategoryName(nextValue);
        categoryValidation.clearError();
    };

    const submitLink = async () => {
        const trimmedTitle = bookmarkTitle.trim();
        const trimmedUrl = bookmarkUrl.trim();
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

    const submitCategory = async () => {
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

    return {
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
    };
}
