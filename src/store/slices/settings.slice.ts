import * as repository from '@/data/settingsRepository';
import type {SettingsSlice, SliceCreator} from '../types';

export const createSettingsSlice: SliceCreator<SettingsSlice> = (_set, get) => ({
    setTheme: async theme => {
        await repository.setTheme(theme);
        await get().refresh();
    },
    setActiveSearchEngineId: async activeSearchEngineId => {
        await repository.setActiveSearchEngineId(activeSearchEngineId);
        await get().refresh();
    },
    setTimeFormat: async timeFormat => {
        await repository.setTimeFormat(timeFormat);
        await get().refresh();
    },
    setTimezone: async timezone => {
        await repository.setTimezone(timezone);
        await get().refresh();
    },
    setLocale: async locale => {
        await repository.setLocale(locale);
        await get().refresh();
    },
    setDateFormat: async dateFormat => {
        await repository.setDateFormat(dateFormat);
        await get().refresh();
    },
    setTabTitle: async tabTitle => {
        await repository.setTabTitle(tabTitle);
        await get().refresh();
    },
    setBackgroundImageFromFile: async file => {
        await repository.setBackgroundImageFromFile(file);
        await get().refresh();
    },
    clearBackgroundImage: async () => {
        await repository.clearBackgroundImage();
        await get().refresh();
    },
    setBackgroundScrimOpacity: async backgroundScrimOpacity => {
        await repository.setBackgroundScrimOpacity(backgroundScrimOpacity);
        await get().refresh();
    },
    setTextColor: async (key, value) => {
        await repository.setTextColor(key, value);
        await get().refresh();
    },
    resetTextColors: async () => {
        await repository.resetTextColors();
        await get().refresh();
    },
    addCustomSearchEngine: async payload => {
        await repository.addCustomSearchEngine(payload);
        await get().refresh();
    },
    removeCustomSearchEngine: async engineId => {
        await repository.removeCustomSearchEngine(engineId);
        await get().refresh();
    },
});
