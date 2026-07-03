export * from './settingsRepository';

export {getBackupReminderDueAt, isBackupReminderOverdue} from './lib/backupReminder';

export {BackgroundImageError, prepareBackgroundImageDataUrl} from './lib/backgroundImage';

export {DEFAULT_SETTINGS, DEFAULT_TAB_TITLE, mergeSettings} from './lib/defaultSettings';
