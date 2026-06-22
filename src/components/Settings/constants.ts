import type {TextColorKey} from '@/db';

export const TIMEZONE_OPTIONS = [
    'auto',
    'Europe/Moscow',
    'Europe/Kaliningrad',
    'Europe/Samara',
    'Asia/Yekaterinburg',
    'Asia/Novosibirsk',
    'Asia/Vladivostok',
    'Europe/London',
    'Europe/Berlin',
    'America/New_York',
    'America/Los_Angeles',
    'Asia/Tokyo',
    'UTC',
];

export const TEXT_COLOR_FIELDS: Array<{ key: TextColorKey; labelKey: 'textColorPrimary' | 'textColorSoft' | 'textColorMuted' }> = [
    {key: 'text', labelKey: 'textColorPrimary'},
    {key: 'textSoft', labelKey: 'textColorSoft'},
    {key: 'textMuted', labelKey: 'textColorMuted'},
];
