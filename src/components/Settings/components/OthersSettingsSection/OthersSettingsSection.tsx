import {Layers3} from 'lucide-react';
import {HintTooltip} from '@/components';
import {Checkbox} from '@/components/Checkbox';
import {useSettings} from '@/dashboard';
import {t} from '@/i18n';
import styles from '../../SettingsPanel.module.scss';
import {BackupSettingsSection} from '../BackupSettingsSection';
import {SettingsSectionHeader} from '../SettingsSectionHeader';

interface OthersSettingsSectionProps {
    dismissRequestId?: number;
}

export function OthersSettingsSection({dismissRequestId = 0}: OthersSettingsSectionProps) {
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
                        label={(
                            <HintTooltip
                                inline
                                locale={locale}
                                label={<span>{t(locale, 'bookmarkFaviconsEnabled')}</span>}
                                hint={t(locale, 'bookmarkFaviconsHint')}
                            />
                        )}
                    />
                </div>
            </div>
            <div className={styles.rowDivider} role="separator" aria-hidden />

            <BackupSettingsSection dismissRequestId={dismissRequestId} embedded />
        </section>
    );
}
