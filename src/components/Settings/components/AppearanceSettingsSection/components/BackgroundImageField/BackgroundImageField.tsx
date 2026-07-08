import {useRef, type ChangeEvent} from 'react';
import {ActionStatus, HintTooltip} from '@/components';
import {useSettings} from '@/dashboard';
import {BackgroundImageError} from '@/data/settings';
import {useActionStatus} from '@/hooks/useActionStatus';
import {t} from '@/i18n';
import panelStyles from '../../../../SettingsPanel.module.scss';
import styles from './BackgroundImageField.module.scss';

export function BackgroundImageField() {
    const {
        settings,
        setBackgroundImageFromFile,
        clearBackgroundImage,
        setBackgroundScrimOpacity,
    } = useSettings();

    const locale = settings.locale;
    const backgroundInputRef = useRef<HTMLInputElement>(null);
    const backgroundStatus = useActionStatus();

    const handlePickBackgroundImageClick = () => {
        backgroundInputRef.current?.click();
    };

    const processBackgroundImageSelection = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        event.target.value = '';

        if (!file) {
            return;
        }

        backgroundStatus.start();

        try {
            await setBackgroundImageFromFile(file);
            backgroundStatus.succeed(t(locale, 'backgroundImageUpdated'));
        } catch (error) {
            if (error instanceof BackgroundImageError) {
                if (error.code === 'invalidType') {
                    backgroundStatus.fail(t(locale, 'backgroundImageInvalidType'));
                    return;
                }

                if (error.code === 'tooLarge') {
                    backgroundStatus.fail(t(locale, 'backgroundImageTooLarge'));
                    return;
                }
            }

            backgroundStatus.fail(t(locale, 'backgroundImageDecodeFailed'));
        }
    };

    const handleBackgroundImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        void processBackgroundImageSelection(event);
    };

    const removeBackgroundImage = async () => {
        backgroundStatus.start();

        try {
            await clearBackgroundImage();
            backgroundStatus.succeed(t(locale, 'backgroundImageRemoved'));
        } catch {
            backgroundStatus.fail(t(locale, 'backgroundImageDecodeFailed'));
        }
    };

    const handleRemoveBackgroundImageClick = () => {
        void removeBackgroundImage();
    };

    const handleBackgroundScrimChange = (event: ChangeEvent<HTMLInputElement>) => {
        void setBackgroundScrimOpacity(Number(event.target.value));
    };

    return (
        <div className={panelStyles.field}>
            <HintTooltip
                locale={locale}
                label={<span className={panelStyles.fieldLabel}>{t(locale, 'backgroundImage')}</span>}
                hint={t(locale, 'backgroundImageHint')}
            />

            <input
                ref={backgroundInputRef}
                type="file"
                accept="image/*"
                className={panelStyles.hiddenInput}
                onChange={handleBackgroundImageChange}
            />

            <div className={panelStyles.inlineRow}>
                <button type="button" onClick={handlePickBackgroundImageClick}>
                    {t(locale, 'chooseBackgroundImage')}
                </button>

                {settings.customBackgroundImage ? (
                    <button type="button" className={panelStyles.dangerButton} onClick={handleRemoveBackgroundImageClick}>
                        {t(locale, 'removeBackgroundImage')}
                    </button>
                ) : null}
            </div>

            {settings.customBackgroundImage ? (
                <div className={styles.backgroundPreview} role="img" aria-label={t(locale, 'backgroundImage')}>
                    <img src={settings.customBackgroundImage} alt="" />
                </div>
            ) : null}

            {settings.customBackgroundImage ? (
                <div className={panelStyles.field}>
                    <label className={styles.scrimField} htmlFor="background-scrim">
                        <HintTooltip
                            inline
                            locale={locale}
                            label={(
                                <span className={styles.scrimLabel}>
                                    {t(locale, 'backgroundScrim')}: {settings.backgroundScrimOpacity}%
                                </span>
                            )}
                            hint={t(locale, 'backgroundScrimHint')}
                        />

                        <input
                            id="background-scrim"
                            className={styles.scrimRange}
                            type="range"
                            min={0}
                            max={100}
                            step={1}
                            value={settings.backgroundScrimOpacity}
                            onChange={handleBackgroundScrimChange}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={settings.backgroundScrimOpacity}
                        />
                    </label>

                </div>
            ) : null}

            <ActionStatus
                status={backgroundStatus.status}
                message={backgroundStatus.message}
                pendingLabel={t(locale, 'backgroundImageProcessing')}
            />
        </div>
    );
}
