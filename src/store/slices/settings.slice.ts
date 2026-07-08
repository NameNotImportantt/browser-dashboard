import * as repository from '@/data/settings/settingsRepository';
import {persistHomeBootstrapCache} from '../lib/persistHomeBootstrapCache';
import {replaceSnapshotField} from '../lib/snapshotMutations';
import type {SettingsSlice, SliceCreator} from '../types';

export const createSettingsSlice: SliceCreator<SettingsSlice> = (set, get) => ({
    setTheme: async theme => {
        const settings = await repository.setTheme(theme);

        replaceSnapshotField(set, 'settings', settings);
        await persistHomeBootstrapCache(get);
    },
    setAccentColor: async accentColor => {
        const settings = await repository.setAccentColor(accentColor);

        replaceSnapshotField(set, 'settings', settings);
        await persistHomeBootstrapCache(get);
    },
    setActiveSearchEngineId: async activeSearchEngineId => {
        const settings = await repository.setActiveSearchEngineId(activeSearchEngineId);

        replaceSnapshotField(set, 'settings', settings);
        await persistHomeBootstrapCache(get);
    },
    setSearchOpenInNewTab: async searchOpenInNewTab => {
        const settings = await repository.setSearchOpenInNewTab(searchOpenInNewTab);

        replaceSnapshotField(set, 'settings', settings);
        await persistHomeBootstrapCache(get);
    },
    setOnlineSearchSuggestionsEnabled: async onlineSearchSuggestionsEnabled => {
        const settings = await repository.setOnlineSearchSuggestionsEnabled(onlineSearchSuggestionsEnabled);

        replaceSnapshotField(set, 'settings', settings);
        await persistHomeBootstrapCache(get);
    },
    setSearchHistoryEnabled: async (searchHistoryEnabled: boolean) => {
        const settings = await repository.setSearchHistoryEnabled(searchHistoryEnabled);

        replaceSnapshotField(set, 'settings', settings);
        await persistHomeBootstrapCache(get);
    },
    setBookmarkFaviconsEnabled: async bookmarkFaviconsEnabled => {
        const settings = await repository.setBookmarkFaviconsEnabled(bookmarkFaviconsEnabled);

        replaceSnapshotField(set, 'settings', settings);
        await persistHomeBootstrapCache(get);
    },
    setBackupReminderEnabled: async backupReminderEnabled => {
        const settings = await repository.setBackupReminderEnabled(backupReminderEnabled);

        replaceSnapshotField(set, 'settings', settings);
        await persistHomeBootstrapCache(get);
    },
    setBackupReminderIntervalDays: async backupReminderIntervalDays => {
        const settings = await repository.setBackupReminderIntervalDays(backupReminderIntervalDays);

        replaceSnapshotField(set, 'settings', settings);
        await persistHomeBootstrapCache(get);
    },
    setLastBackupExportedAt: async lastBackupExportedAt => {
        const settings = await repository.setLastBackupExportedAt(lastBackupExportedAt);

        replaceSnapshotField(set, 'settings', settings);
        await persistHomeBootstrapCache(get);
    },
    setTimeFormat: async timeFormat => {
        const settings = await repository.setTimeFormat(timeFormat);

        replaceSnapshotField(set, 'settings', settings);
        await persistHomeBootstrapCache(get);
    },
    setTimezone: async timezone => {
        const settings = await repository.setTimezone(timezone);

        replaceSnapshotField(set, 'settings', settings);
        await persistHomeBootstrapCache(get);
    },
    setLocale: async locale => {
        const settings = await repository.setLocale(locale);

        replaceSnapshotField(set, 'settings', settings);
        await persistHomeBootstrapCache(get);
    },
    setDateFormat: async dateFormat => {
        const settings = await repository.setDateFormat(dateFormat);

        replaceSnapshotField(set, 'settings', settings);
        await persistHomeBootstrapCache(get);
    },
    setTabTitle: async tabTitle => {
        const settings = await repository.setTabTitle(tabTitle);

        replaceSnapshotField(set, 'settings', settings);
        await persistHomeBootstrapCache(get);
    },
    setBackgroundImageFromFile: async file => {
        const settings = await repository.setBackgroundImageFromFile(file);

        replaceSnapshotField(set, 'settings', settings);
        await persistHomeBootstrapCache(get);
    },
    clearBackgroundImage: async () => {
        const settings = await repository.clearBackgroundImage();

        replaceSnapshotField(set, 'settings', settings);
        await persistHomeBootstrapCache(get);
    },
    setBackgroundScrimOpacity: async backgroundScrimOpacity => {
        const settings = await repository.setBackgroundScrimOpacity(backgroundScrimOpacity);

        replaceSnapshotField(set, 'settings', settings);
        await persistHomeBootstrapCache(get);
    },
    setTextColor: async (key, value) => {
        const settings = await repository.setTextColor(key, value);

        replaceSnapshotField(set, 'settings', settings);
        await persistHomeBootstrapCache(get);
    },
    resetTextColors: async () => {
        const settings = await repository.resetTextColors();

        replaceSnapshotField(set, 'settings', settings);
        await persistHomeBootstrapCache(get);
    },
    addCustomSearchEngine: async payload => {
        const settings = await repository.addCustomSearchEngine(payload);

        if (settings) {
            replaceSnapshotField(set, 'settings', settings);
            await persistHomeBootstrapCache(get);
        }
    },
    removeCustomSearchEngine: async engineId => {
        const settings = await repository.removeCustomSearchEngine(engineId);

        replaceSnapshotField(set, 'settings', settings);
        await persistHomeBootstrapCache(get);
    },
});
