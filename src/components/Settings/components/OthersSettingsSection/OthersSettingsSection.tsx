import {Layers3} from 'lucide-react';
import {t} from '@/app';
import {Checkbox} from '@/components/Checkbox';
import {useSettings} from '@/dashboard';
import styles from '../../SettingsPanel.module.scss';
<<<<<<< Updated upstream
=======
import {SettingsSectionHeader} from '../SettingsSectionHeader';
import {BackupSettingsSection} from '../BackupSettingsSection';
>>>>>>> Stashed changes

export function OthersSettingsSection() {
    const {settings, setBookmarkFaviconsEnabled} = useSettings();
    const locale = settings.locale;

    return (
        <section className={styles.section}>
            <SettingsSectionHeader title={t(locale, 'settingsOthers')} icon={Layers3} />
            <div className={styles.grid}>
                <div className={styles.field}>
                    <Checkbox
                        checked={settings.bookmarkFaviconsEnabled}
                        onChange={() => void setBookmarkFaviconsEnabled(!settings.bookmarkFaviconsEnabled)}
                        label={t(locale, 'bookmarkFaviconsEnabled')}
                    />
                    <small className={styles.hint}>{t(locale, 'bookmarkFaviconsHint')}</small>
                </div>
            </div>
        </section>
    );
}
