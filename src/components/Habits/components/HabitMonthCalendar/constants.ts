import type {AppLocale} from '@/db';

export const MONDAY_FIRST_WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

export const SUNDAY_FIRST_WEEKDAY_ORDER = [0, 1, 2, 3, 4, 5, 6];

export const WEEKDAY_ORDER_BY_LOCALE: Record<AppLocale, number[]> = {
    en: SUNDAY_FIRST_WEEKDAY_ORDER,
    ru: MONDAY_FIRST_WEEKDAY_ORDER,
};
