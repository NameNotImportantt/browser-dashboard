import {create} from 'zustand';
import {instrumentStoreActions} from './lib/instrumentStoreActions';
import {createBookmarksSlice} from './slices/bookmarks.slice';
import {createCoreSlice} from './slices/core.slice';
import {createHabitsSlice} from './slices/habits.slice';
import {createNotesSlice} from './slices/notes.slice';
import {createSearchHistorySlice} from './slices/searchHistory.slice';
import {createSettingsSlice} from './slices/settings.slice';
import {createTodosSlice} from './slices/todos.slice';
import {createUndoSlice} from './slices/undo.slice';
import {createWeatherSlice} from './slices/weather.slice';
import {createWorkspacesSlice} from './slices/workspaces.slice';
import type {DashboardStore} from './types';

export const useDashboardStore = create<DashboardStore>()((set, get) => instrumentStoreActions({
    ...createCoreSlice(set, get),
    ...createWorkspacesSlice(set, get),
    ...createUndoSlice(set, get),
    ...createSettingsSlice(set, get),
    ...createTodosSlice(set, get),
    ...createHabitsSlice(set, get),
    ...createBookmarksSlice(set, get),
    ...createNotesSlice(set, get),
    ...createWeatherSlice(set, get),
    ...createSearchHistorySlice(set, get),
}));
