import {Layers3} from 'lucide-react';
import {HintTooltip} from '@/components';
import {Checkbox} from '@/components/Checkbox';
import {useSettings} from '@/dashboard';
import {t} from '@/i18n';
import styles from '../../SettingsPanel.module.scss';
import {BackupSettingsSection} from '../BackupSettingsSection';
import {SettingsColumn} from '../SettingsColumn/SettingsColumn';
import {SettingsSubsection} from '../SettingsSubsection/SettingsSubsection';

interface OthersSettingsSectionProps {
    dismissRequestId?: number;
}

export function OthersSettingsSection({dismissRequestId = 0}: OthersSettingsSectionProps) {
    const {settings, setBookmarkFaviconsEnabled} = useSettings();
    const locale = settings.locale;

    return (
        <SettingsColumn title={t(locale, 'settingsOthers')} icon={Layers3}>
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
            <SettingsSubsection title={t(locale, 'settingsBackup')} showDivider>
                <BackupSettingsSection dismissRequestId={dismissRequestId} />
            </SettingsSubsection>
        </SettingsColumn>
    );
}
