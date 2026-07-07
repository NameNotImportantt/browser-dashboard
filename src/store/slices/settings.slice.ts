import * as repository from '@/data/settings/settingsRepository';
import {replaceSnapshotField} from '../lib/snapshotMutations';
import type {SettingsSlice, SliceCreator} from '../types';

export const createSettingsSlice: SliceCreator<SettingsSlice> = set => ({
    setTheme: async theme => {
        const settings = await repository.setTheme(theme);

        replaceSnapshotField(set, 'settings', settings);
    },
    setActiveSearchEngineId: async activeSearchEngineId => {
        const settings = await repository.setActiveSearchEngineId(activeSearchEngineId);

        replaceSnapshotField(set, 'settings', settings);
    },
    setSearchOpenInNewTab: async searchOpenInNewTab => {
        const settings = await repository.setSearchOpenInNewTab(searchOpenInNewTab);

        replaceSnapshotField(set, 'settings', settings);
    },
    setOnlineSearchSuggestionsEnabled: async onlineSearchSuggestionsEnabled => {
        const settings = await repository.setOnlineSearchSuggestionsEnabled(onlineSearchSuggestionsEnabled);

        replaceSnapshotField(set, 'settings', settings);
    },
    setSearchHistoryEnabled: async (searchHistoryEnabled: boolean) => {
        const settings = await repository.setSearchHistoryEnabled(searchHistoryEnabled);

        replaceSnapshotField(set, 'settings', settings);
    },
    setBookmarkFaviconsEnabled: async bookmarkFaviconsEnabled => {
        const settings = await repository.setBookmarkFaviconsEnabled(bookmarkFaviconsEnabled);

        replaceSnapshotField(set, 'settings', settings);
    },
    setBackupReminderEnabled: async backupReminderEnabled => {
        const settings = await repository.setBackupReminderEnabled(backupReminderEnabled);

        replaceSnapshotField(set, 'settings', settings);
    },
    setBackupReminderIntervalDays: async backupReminderIntervalDays => {
        const settings = await repository.setBackupReminderIntervalDays(backupReminderIntervalDays);

        replaceSnapshotField(set, 'settings', settings);
    },
    setLastBackupExportedAt: async lastBackupExportedAt => {
        const settings = await repository.setLastBackupExportedAt(lastBackupExportedAt);

        replaceSnapshotField(set, 'settings', settings);
    },
    setTimeFormat: async timeFormat => {
        const settings = await repository.setTimeFormat(timeFormat);

        replaceSnapshotField(set, 'settings', settings);
    },
    setTimezone: async timezone => {
        const settings = await repository.setTimezone(timezone);

        replaceSnapshotField(set, 'settings', settings);
    },
    setLocale: async locale => {
        const settings = await repository.setLocale(locale);

        replaceSnapshotField(set, 'settings', settings);
    },
    setDateFormat: async dateFormat => {
        const settings = await repository.setDateFormat(dateFormat);

        replaceSnapshotField(set, 'settings', settings);
    },
    setTabTitle: async tabTitle => {
        const settings = await repository.setTabTitle(tabTitle);

        replaceSnapshotField(set, 'settings', settings);
    },
    setBackgroundImageFromFile: async file => {
        const settings = await repository.setBackgroundImageFromFile(file);

        replaceSnapshotField(set, 'settings', settings);
    },
    clearBackgroundImage: async () => {
        const settings = await repository.clearBackgroundImage();

        replaceSnapshotField(set, 'settings', settings);
    },
    setBackgroundScrimOpacity: async backgroundScrimOpacity => {
        const settings = await repository.setBackgroundScrimOpacity(backgroundScrimOpacity);

        replaceSnapshotField(set, 'settings', settings);
    },
    setTextColor: async (key, value) => {
        const settings = await repository.setTextColor(key, value);

        replaceSnapshotField(set, 'settings', settings);
    },
    resetTextColors: async () => {
        const settings = await repository.resetTextColors();

        replaceSnapshotField(set, 'settings', settings);
    },
    addCustomSearchEngine: async payload => {
        const settings = await repository.addCustomSearchEngine(payload);

        if (settings) {
            replaceSnapshotField(set, 'settings', settings);
        }
    },
    removeCustomSearchEngine: async engineId => {
        const settings = await repository.removeCustomSearchEngine(engineId);

        replaceSnapshotField(set, 'settings', settings);
    },
});
