import {useEffect, useState} from 'react';
import clsx from 'clsx';
import {HintTooltip} from '@/components';
import {Checkbox} from '@/components/Checkbox';
import {Modal} from '@/components/Modal';
import {t} from '@/i18n';
import settingsStyles from '../../../../SettingsPanel.module.scss';
import styles from './SearchHistoryControls.module.scss';
import type {AppLocale, SearchHistoryEntry} from '@/db';

export interface SearchHistoryControlsProps {
  dismissRequestId?: number;
  locale: AppLocale;
  searchHistoryEnabled: boolean;
  searchHistory: SearchHistoryEntry[];
  onToggleSearchHistoryEnabled: (enabled: boolean) => Promise<void>;
  onClearSearchHistory: () => Promise<void>;
  onDeleteSearchHistoryEntries: (entryIds: string[]) => Promise<void>;
}

export function SearchHistoryControls({
    dismissRequestId = 0,
    locale,
    searchHistoryEnabled,
    searchHistory,
    onToggleSearchHistoryEnabled,
    onClearSearchHistory,
    onDeleteSearchHistoryEntries,
}: SearchHistoryControlsProps) {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [selectedHistoryIds, setSelectedHistoryIds] = useState<string[]>([]);
    const selectedCount = selectedHistoryIds.length;
    const clearHistoryButtonClassName = clsx(styles.dangerButton, styles.compactButton);
    const checkboxFieldClassName = clsx(settingsStyles.field, styles.checkboxField);
    const deleteSelectedButtonClassName = clsx(styles.dangerButton, styles.compactButton);

    const toggleHistorySelection = (entryId: string) => {
        setSelectedHistoryIds(current =>
            current.includes(entryId) ? current.filter(currentId => currentId !== entryId) : [...current, entryId],
        );
    };

    const selectAllHistory = () => {
        setSelectedHistoryIds(searchHistory.map(entry => entry.id));
    };

    const clearSelection = () => {
        setSelectedHistoryIds([]);
    };

    const closeHistoryModal = () => {
        setSelectedHistoryIds([]);
        setIsHistoryOpen(false);
    };

    useEffect(() => {
        closeHistoryModal();
    }, [dismissRequestId]);

    const removeSelectedHistory = async () => {
        if (!selectedHistoryIds.length) {
            return;
        }

        await onDeleteSearchHistoryEntries(selectedHistoryIds);
        closeHistoryModal();
    };

    return (
        <>
            <div className={settingsStyles.field}>
                <div className={styles.historyActionsRow}>
                    <button
                        type="button"
                        className={styles.historyButton}
                        onClick={() => setIsHistoryOpen(true)}
                    >
                        {t(locale, 'viewSearchHistory')}
                    </button>
                    {searchHistory.length > 0 ? (
                        <button
                            type="button"
                            className={clearHistoryButtonClassName}
                            onClick={() => void onClearSearchHistory()}
                        >
                            {t(locale, 'clearSearchHistory')}
                        </button>
                    ) : null}
                </div>
                {searchHistory.length === 0 ? <small className={settingsStyles.hint}>{t(locale, 'searchHistoryEmpty')}</small> : null}
            </div>

            <div className={checkboxFieldClassName}>
                <Checkbox
                    checked={searchHistoryEnabled}
                    onChange={() => void onToggleSearchHistoryEnabled(!searchHistoryEnabled)}
                    label={(
                        <HintTooltip
                            inline
                            locale={locale}
                            label={<span>{t(locale, 'searchHistoryEnabled')}</span>}
                            hint={t(locale, 'searchHistoryDisabledHint')}
                        />
                    )}
                />
            </div>

            {isHistoryOpen ? (
                <Modal
                    open={isHistoryOpen}
                    title={t(locale, 'searchHistory')}
                    onClose={closeHistoryModal}
                    closeLabel={t(locale, 'close')}
                    confirmLabel={t(locale, 'deleteSelected')}
                    onConfirm={() => void removeSelectedHistory()}
                    confirmDisabled={selectedCount === 0}
                    confirmButtonClassName={deleteSelectedButtonClassName}
                    footerContent={(
                        <>
                            <button type="button" className={styles.compactButton} onClick={selectAllHistory}>
                                {t(locale, 'selectAll')}
                            </button>
                            <button type="button" className={styles.compactButton} onClick={clearSelection}>
                                {t(locale, 'clearSelection')}
                            </button>
                            {selectedCount === 0 ? (
                                <small className={settingsStyles.hint}>{t(locale, 'searchHistorySelectionEmpty')}</small>
                            ) : null}
                        </>
                    )}
                    showCloseIcon
                >
                    {searchHistory.length > 0 ? (
                        <ul className={styles.historyList}>
                            {searchHistory.map(entry => (
                                <li key={entry.id} className={styles.historyItem}>
                                    <Checkbox
                                        checked={selectedHistoryIds.includes(entry.id)}
                                        onChange={() => toggleHistorySelection(entry.id)}
                                        className={styles.historyCheckbox}
                                        label={<span className={styles.historyQuery}>{entry.query}</span>}
                                    />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <small className={settingsStyles.hint}>{t(locale, 'searchHistoryEmpty')}</small>
                    )}
                </Modal>
            ) : null}
        </>
    );
}
