import clsx from 'clsx';
import {Palette} from 'lucide-react';
import {useSettings} from '@/dashboard';
import {t} from '@/i18n';
import styles from '../../SettingsPanel.module.scss';
import {SettingsSectionHeader} from '../SettingsSectionHeader';
import {TextColorField} from '../TextColorField';
import {BackgroundImageField} from './components';
import {useAppearanceTextColors} from './hooks/useAppearanceTextColors';

export function AppearanceSettingsSection() {
    const {settings} = useSettings();
    const locale = settings.locale;
    const sectionClassName = clsx(styles.section, styles.sectionFirst);
    const {textColorFields, handleResetTextColorsClick} = useAppearanceTextColors();

    return (
        <section className={sectionClassName}>
            <SettingsSectionHeader title={t(locale, 'settingsAppearance')} icon={Palette} />

            <div className={styles.grid}>
                <BackgroundImageField />

                {textColorFields.map(field => (
                    <TextColorField
                        key={field.key}
                        label={field.label}
                        value={field.value}
                        pickerValue={field.pickerValue}
                        placeholder={field.placeholder}
                        swatches={field.swatches}
                        onChange={field.onChange}
                    />
                ))}

                <div className={styles.field}>
                    <button type="button" onClick={handleResetTextColorsClick}>
                        {t(locale, 'resetTextColors')}
                    </button>
                </div>
            </div>
        </section>
    );
}
