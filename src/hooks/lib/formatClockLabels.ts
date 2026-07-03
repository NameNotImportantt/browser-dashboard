import type {AppLocale, DateFormatPreset, TimeFormat} from '@/db';

function resolveTimezone(timezone: string) {
    if (timezone === 'auto') {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    return timezone;
}

function formatDateByPreset(now: Date, preset: DateFormatPreset, locale: string, timeZone: string) {
    const parts = new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone,
    }).formatToParts(now);

    const day = parts.find(part => part.type === 'day')?.value ?? '01';
    const month = parts.find(part => part.type === 'month')?.value ?? '01';
    const year = parts.find(part => part.type === 'year')?.value ?? '1970';

    if (preset === 'MM/dd/yyyy') {
        return `${month}/${day}/${year}`;
    }

    if (preset === 'yyyy-MM-dd') {
        return `${year}-${month}-${day}`;
    }

    return `${day}.${month}.${year}`;
}

export function formatClockLabels(
    now: Date,
    options: {
        locale: AppLocale;
        timeFormat: TimeFormat;
        dateFormat: DateFormatPreset;
        timezone: string;
    },
) {
    const intlLocale = options.locale === 'en' ? 'en-US' : 'ru-RU';
    const timeZone = resolveTimezone(options.timezone);

    const timeLabel = new Intl.DateTimeFormat(intlLocale, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: options.timeFormat === '12h',
        timeZone,
    }).format(now);

    const dateLabel = formatDateByPreset(now, options.dateFormat, intlLocale, timeZone);

    return {timeLabel, dateLabel};
}
