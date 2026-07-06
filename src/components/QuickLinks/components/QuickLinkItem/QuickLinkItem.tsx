import {Link} from 'lucide-react';
import {t} from '@/i18n';
import styles from './QuickLinkItem.module.scss';
import type {AppLocale, Bookmark} from '@/db';

interface QuickLinkItemProps {
    areBookmarkFaviconsEnabled: boolean;
    bookmark: Bookmark;
    locale: AppLocale;
    onDelete: (bookmarkId: string) => Promise<void>;
    showSeparator: boolean;
}

export function QuickLinkItem({
    areBookmarkFaviconsEnabled,
    bookmark,
    locale,
    onDelete,
    showSeparator,
}: QuickLinkItemProps) {
    const handleDeleteClick = () => {
        void onDelete(bookmark.id);
    };

    return (
        <>
            {showSeparator ? (
                <span className={styles.separator} aria-hidden>
                    |
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
                    x
                </button>
            </span>
        </>
    );
}
