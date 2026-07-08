import type {
    AppSettings,
    Bookmark,
    BookmarkCategory,
    Habit,
    Note,
    SearchHistoryEntry,
    TodoItem,
    WeatherCache,
    Workspace,
} from '@/db';

export interface DashboardBackupSettings extends Omit<AppSettings, 'weatherProvider' | 'weatherApiKey'> {
  weatherProvider?: AppSettings['weatherProvider'];
  weatherApiKey?: string | null;
}

export interface DashboardBackupWeatherCache extends Omit<WeatherCache, 'provider'> {
  provider?: WeatherCache['provider'];
}

export interface DashboardBackupNote extends Omit<Note, 'title' | 'createdAt' | 'position'> {
  title?: string;
  createdAt?: number;
  position?: number;
}

export const BACKUP_SCHEMA_VERSION = 1;

export const BACKUP_APP_NAME = 'Browser Dashboard';

export const BACKUP_MIME_TYPE = 'application/json';

export interface DashboardBackupData {
  workspaces: Workspace[];
  todos: TodoItem[];
  habits: Habit[];
  bookmarks: Bookmark[];
  bookmarkCategories: BookmarkCategory[];
  notes: DashboardBackupNote[];
  settings: DashboardBackupSettings;
  weatherCache: DashboardBackupWeatherCache | null;
  searchHistory: SearchHistoryEntry[];
}

export interface DashboardBackupEnvelope {
  schemaVersion: number;
  exportedAt: number;
  appName: string;
  data: DashboardBackupData;
}

export interface DashboardBackupDownloadPayload {
  blob: Blob;
  fileName: string;
  json: string;
  exportedAt: number;
  mimeType: string;
}

export type DashboardBackupErrorCode =
  | 'invalidJson'
  | 'invalidEnvelope'
  | 'unsupportedSchemaVersion'
  | 'importFailed';

export class DashboardBackupError extends Error {
    public code: DashboardBackupErrorCode;

    public constructor(code: DashboardBackupErrorCode, message: string) {
        super(message);
        this.code = code;
        this.name = 'DashboardBackupError';
    }
}
