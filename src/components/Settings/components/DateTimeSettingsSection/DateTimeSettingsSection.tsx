import {useMemo} from 'react';
import {CalendarClock} from 'lucide-react';
import {Select} from '@/components/Select';
import {useSettings} from '@/dashboard';
import {t} from '@/i18n';
import {TIMEZONE_OPTIONS} from '../../constants';
import styles from '../../SettingsPanel.module.scss';
import {SettingsSectionHeader} from '../SettingsSectionHeader';

interface DateTimeSettingsSectionProps {
  dismissRequestId?: number;
}

export function DateTimeSettingsSection({dismissRequestId = 0}: DateTimeSettingsSectionProps) {
    const {settings, setTimeFormat, setTimezone, setDateFormat} = useSettings();
    const locale = settings.locale;

    const timeFormatOptions = useMemo(
        () => [
            {value: '24h', label: t(locale, 'format24h')},
            {value: '12h', label: t(locale, 'format12h')},
        ],
        [locale],
    );

    const timezoneOptions = useMemo(
        () =>
            TIMEZONE_OPTIONS.map(zone => ({
                value: zone,
                label: zone === 'auto' ? t(locale, 'autoTimezone') : zone,
            })),
        [locale],
    );

    const dateFormatOptions = useMemo(
        () => [
            {value: 'dd.MM.yyyy', label: 'dd.MM.yyyy'},
            {value: 'MM/dd/yyyy', label: 'MM/dd/yyyy'},
            {value: 'yyyy-MM-dd', label: 'yyyy-MM-dd'},
        ],
        [],
    );

    return (
        <section className={styles.section}>
            <SettingsSectionHeader title={t(locale, 'settingsDateTime')} icon={CalendarClock} />
            <div className={styles.grid}>
                <div className={styles.field}>
                    <span className={styles.fieldLabel}>{t(locale, 'timeFormat')}</span>
                    <Select
                        dismissRequestId={dismissRequestId}
                        value={settings.timeFormat}
                        options={timeFormatOptions}
                        onChange={value => void setTimeFormat(value as typeof settings.timeFormat)}
                        ariaLabel={t(locale, 'timeFormat')}
                    />
                </div>

                <div className={styles.field}>
                    <span className={styles.fieldLabel}>{t(locale, 'timezone')}</span>
                    <Select
                        dismissRequestId={dismissRequestId}
                        value={settings.timezone}
                        options={timezoneOptions}
                        onChange={value => void setTimezone(value)}
                        ariaLabel={t(locale, 'timezone')}
                    />
                </div>

                <div className={styles.field}>
                    <span className={styles.fieldLabel}>{t(locale, 'dateFormat')}</span>
                    <Select
                        dismissRequestId={dismissRequestId}
                        value={settings.dateFormat}
                        options={dateFormatOptions}
                        onChange={value => void setDateFormat(value as typeof settings.dateFormat)}
                        ariaLabel={t(locale, 'dateFormat')}
                    />
                </div>
            </div>
        </section>
    );
}
