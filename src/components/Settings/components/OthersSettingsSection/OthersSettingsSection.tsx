import {t} from '@/app';
import {Checkbox} from '@/components/Checkbox';
import {useSettings} from '@/dashboard';
import styles from '../../SettingsPanel.module.scss';

export function OthersSettingsSection() {
    const {settings, setBookmarkFaviconsEnabled} = useSettings();
    const locale = settings.locale;

    return (
        <section className={styles.section}>
            <h3>{t(locale, 'settingsOthers')}</h3>
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
