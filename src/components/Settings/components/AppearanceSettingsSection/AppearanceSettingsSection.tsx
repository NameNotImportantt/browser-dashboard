import {Palette} from 'lucide-react';
import {useSettings} from '@/dashboard';
import {t} from '@/i18n';
import styles from '../../SettingsPanel.module.scss';
import {SettingsColumn} from '../SettingsColumn/SettingsColumn';
import {TextColorField} from '../TextColorField';
import {BackgroundImageField} from './components';
import {useAppearanceAccentColor} from './hooks/useAppearanceAccentColor';
import {useAppearanceTextColors} from './hooks/useAppearanceTextColors';

export function AppearanceSettingsSection() {
    const {settings} = useSettings();
    const locale = settings.locale;
    const {accentColorField, handleResetAccentColorClick} = useAppearanceAccentColor();
    const {textColorFields, handleResetTextColorsClick} = useAppearanceTextColors();

    return (
        <SettingsColumn title={t(locale, 'settingsAppearance')} icon={Palette}>

            <div className={styles.grid}>
                <BackgroundImageField />

                <TextColorField
                    invalidMessage={t(locale, 'textColorHexInvalid')}
                    label={accentColorField.label}
                    value={accentColorField.value}
                    pickerValue={accentColorField.pickerValue}
                    placeholder={accentColorField.placeholder}
                    swatches={accentColorField.swatches}
                    onChange={accentColorField.onChange}
                />

                <div className={styles.field}>
                    <button type="button" onClick={handleResetAccentColorClick}>
                        {t(locale, 'resetAccentColor')}
                    </button>
                </div>

                {textColorFields.map(field => (
                    <TextColorField
                        key={field.key}
                        invalidMessage={t(locale, 'textColorHexInvalid')}
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
        </SettingsColumn>
    );
}
