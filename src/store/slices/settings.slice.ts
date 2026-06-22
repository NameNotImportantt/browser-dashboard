import * as repository from '@/data/settingsRepository';
import type {SettingsSlice, SliceCreator} from '../types';
import type {AppSettings} from '@/db';

function patchSnapshotSettings(set: Parameters<SliceCreator<SettingsSlice>>[0], settings: AppSettings | null) {
    if (!settings) {return;}

    set(state => {
        if (!state.snapshot) {
            return {};
        }

        return {
            snapshot: {
                ...state.snapshot,
                settings,
            },
        };
    });
}

export const createSettingsSlice: SliceCreator<SettingsSlice> = set => ({
    setTheme: async theme => {
        patchSnapshotSettings(set, await repository.setTheme(theme));
    },
    setActiveSearchEngineId: async activeSearchEngineId => {
        patchSnapshotSettings(set, await repository.setActiveSearchEngineId(activeSearchEngineId));
    },
    setOnlineSearchSuggestionsEnabled: async onlineSearchSuggestionsEnabled => {
        patchSnapshotSettings(set, await repository.setOnlineSearchSuggestionsEnabled(onlineSearchSuggestionsEnabled));
    },
    setSearchHistoryEnabled: async (searchHistoryEnabled: boolean) => {
        patchSnapshotSettings(set, await repository.setSearchHistoryEnabled(searchHistoryEnabled));
    },
    setBookmarkFaviconsEnabled: async bookmarkFaviconsEnabled => {
        patchSnapshotSettings(set, await repository.setBookmarkFaviconsEnabled(bookmarkFaviconsEnabled));
    },
    setTimeFormat: async timeFormat => {
        patchSnapshotSettings(set, await repository.setTimeFormat(timeFormat));
    },
    setTimezone: async timezone => {
        patchSnapshotSettings(set, await repository.setTimezone(timezone));
    },
    setLocale: async locale => {
        patchSnapshotSettings(set, await repository.setLocale(locale));
    },
    setDateFormat: async dateFormat => {
        patchSnapshotSettings(set, await repository.setDateFormat(dateFormat));
    },
    setTabTitle: async tabTitle => {
        patchSnapshotSettings(set, await repository.setTabTitle(tabTitle));
    },
    setBackgroundImageFromFile: async file => {
        patchSnapshotSettings(set, await repository.setBackgroundImageFromFile(file));
    },
    clearBackgroundImage: async () => {
        patchSnapshotSettings(set, await repository.clearBackgroundImage());
    },
    setBackgroundScrimOpacity: async backgroundScrimOpacity => {
        patchSnapshotSettings(set, await repository.setBackgroundScrimOpacity(backgroundScrimOpacity));
    },
    setTextColor: async (key, value) => {
        patchSnapshotSettings(set, await repository.setTextColor(key, value));
    },
    resetTextColors: async () => {
        patchSnapshotSettings(set, await repository.resetTextColors());
    },
    addCustomSearchEngine: async payload => {
        patchSnapshotSettings(set, await repository.addCustomSearchEngine(payload));
    },
    removeCustomSearchEngine: async engineId => {
        patchSnapshotSettings(set, await repository.removeCustomSearchEngine(engineId));
    },
});
