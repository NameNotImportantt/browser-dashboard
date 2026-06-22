import clsx from 'clsx';
import {t} from '@/app';
import {useSettings} from '@/dashboard';
import {AppearanceSettingsSection} from './components/AppearanceSettingsSection';
import {DateTimeSettingsSection} from './components/DateTimeSettingsSection';
import {GeneralSettingsSection} from './components/GeneralSettingsSection';
import {OthersSettingsSection} from './components/OthersSettingsSection';
import {SearchEnginesSettingsSection} from './components/SearchEnginesSettingsSection';
import styles from './SettingsPanel.module.scss';

export function SettingsPanel() {
    const {settings} = useSettings();
    const locale = settings.locale;
    const settingsPanelClassName = clsx('card', styles.settingsPanel);

    return (
        <section className={settingsPanelClassName} aria-label={t(locale, 'settings')}>
            <header className={styles.header}>
                <h2>{t(locale, 'settings')}</h2>
            </header>

            <div className={styles.rows}>
                <GeneralSettingsSection />
                <DateTimeSettingsSection />
                <SearchEnginesSettingsSection />

                <div className={styles.rowDivider} role="separator" aria-hidden />

                <AppearanceSettingsSection />
                <OthersSettingsSection />
            </div>
        </section>
    );
}
