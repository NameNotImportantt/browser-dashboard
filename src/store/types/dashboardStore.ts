import type {BookmarksSlice} from './bookmarksSlice';
import type {CoreSlice} from './coreSlice';
import type {HabitsSlice} from './habitsSlice';
import type {NotesSlice} from './notesSlice';
import type {SearchHistorySlice} from './searchHistorySlice';
import type {SettingsSlice} from './settingsSlice';
import type {TodosSlice} from './todosSlice';
import type {UndoSlice} from './undoSlice';
import type {WeatherSlice} from './weatherSlice';
import type {WorkspacesSlice} from './workspacesSlice';

export type DashboardStore = CoreSlice &
  WorkspacesSlice &
  UndoSlice &
  SettingsSlice &
  TodosSlice &
  HabitsSlice &
  BookmarksSlice &
  NotesSlice &
  WeatherSlice &
  SearchHistorySlice;
