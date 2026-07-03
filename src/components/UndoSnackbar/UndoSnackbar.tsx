import {useEffect, useState} from 'react';
import {useSettings, useUndo} from '@/dashboard';
import {t} from '@/i18n';
import {UndoActionKind} from '@/store/types/undoActionKind';
import styles from './UndoSnackbar.module.scss';

export function UndoSnackbar() {
    const {locale} = useSettings();
    const {currentUndoEntry, clearExpiredUndoEntry, clearCurrentUndoEntry, undoCurrentUndoEntry} = useUndo();
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        setIsPending(false);
    }, [currentUndoEntry?.id]);

    useEffect(() => {
        if (!currentUndoEntry) {
            return;
        }

        const timeoutMs = currentUndoEntry.expiresAt - Date.now();

        if (timeoutMs <= 0) {
            clearExpiredUndoEntry();
            return;
        }

        const timeoutId = window.setTimeout(() => {
            clearExpiredUndoEntry();
        }, timeoutMs);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [clearExpiredUndoEntry, currentUndoEntry]);

    if (!currentUndoEntry) {
        return null;
    }

    const undo = async () => {
        setIsPending(true);

        try {
            await undoCurrentUndoEntry();
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className={styles.root} role="status" aria-live="polite" aria-atomic="true">
            <div className={styles.snackbar}>
                <p className={styles.message}>{buildUndoMessage(locale, currentUndoEntry)}</p>
                <div className={styles.actions}>
                    <button type="button" className={styles.actionButton} onClick={() => void undo()} disabled={isPending}>
                        {t(locale, 'undoAction')}
                    </button>
                    <button type="button" className={styles.dismissButton} onClick={clearCurrentUndoEntry} disabled={isPending}>
                        {t(locale, 'dismissAction')}
                    </button>
                </div>
            </div>
        </div>
    );
}

function buildUndoMessage(
    locale: 'ru' | 'en',
    currentUndoEntry: ReturnType<typeof useUndo>['currentUndoEntry'],
) {
    if (!currentUndoEntry) {
        return '';
    }

    if (currentUndoEntry.kind === UndoActionKind.TodoDelete) {
        return t(locale, 'undoDeletedTodo');
    }

    if (currentUndoEntry.kind === UndoActionKind.BookmarkDelete) {
        return t(locale, 'undoDeletedBookmark');
    }

    if (currentUndoEntry.kind === UndoActionKind.BookmarkCategoryDelete) {
        return t(locale, 'undoDeletedBookmarkCategory');
    }

    if (currentUndoEntry.kind === UndoActionKind.WorkspaceDelete) {
        return t(locale, 'undoDeletedWorkspace');
    }

    if (currentUndoEntry.clearedAll) {
        return t(locale, 'undoClearedSearchHistory');
    }

    if (currentUndoEntry.entries.length === 1) {
        return t(locale, 'undoDeletedSearchHistoryEntry');
    }

    return locale === 'ru'
        ? `Удалено записей истории поиска: ${currentUndoEntry.entries.length}`
        : `${currentUndoEntry.entries.length} search history items deleted`;
}
