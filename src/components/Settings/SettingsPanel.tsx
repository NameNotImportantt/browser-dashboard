import clsx from 'clsx';
import {useSettings} from '@/dashboard';
import {t} from '@/i18n';
import {AboutSettingsSection} from './components/AboutSettingsSection';
import {AppearanceSettingsSection} from './components/AppearanceSettingsSection';
import {DateTimeSettingsSection} from './components/DateTimeSettingsSection';
import {GeneralSettingsSection} from './components/GeneralSettingsSection';
import {OthersSettingsSection} from './components/OthersSettingsSection';
import {SearchEnginesSettingsSection} from './components/SearchEnginesSettingsSection';
import styles from './SettingsPanel.module.scss';

interface SettingsPanelProps {
  dismissRequestId?: number;
}

export function SettingsPanel({dismissRequestId = 0}: SettingsPanelProps) {
    const {settings} = useSettings();
    const locale = settings.locale;
    const settingsScreenClassName = styles.settingsScreen;
    const settingsPanelClassName = clsx('card', styles.settingsPanel);

    return (
        <div className={settingsScreenClassName}>
            <section className={settingsPanelClassName} aria-label={t(locale, 'settings')}>
                <header className={styles.header}>
                    <h2>{t(locale, 'settings')}</h2>
                </header>

                <div className={styles.rows}>
                    <GeneralSettingsSection dismissRequestId={dismissRequestId} />
                    <div className={styles.columnDivider} role="separator" aria-hidden />
                    <DateTimeSettingsSection dismissRequestId={dismissRequestId} />
                    <div className={styles.columnDivider} role="separator" aria-hidden />
                    <SearchEnginesSettingsSection dismissRequestId={dismissRequestId} />

                    <div className={styles.rowDivider} role="separator" aria-hidden />

                    <AppearanceSettingsSection />
                    <div className={styles.columnDivider} role="separator" aria-hidden />
                    <OthersSettingsSection dismissRequestId={dismissRequestId} />
                    <div className={styles.columnDivider} role="separator" aria-hidden />
                    <AboutSettingsSection dismissRequestId={dismissRequestId} />
                </div>
            </section>
        </div>
    );
}
