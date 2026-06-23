import {useEffect, useState} from 'react';
import clsx from 'clsx';
import {BookOpenText, CircleHelp, ExternalLink} from 'lucide-react';
import {KEYBOARD_SHORTCUTS, t} from '@/app';
import appIconUrl from '@/assets/favicon-32x32.png';
import {useSettings} from '@/dashboard';
import panelStyles from '../../SettingsPanel.module.scss';
import styles from './AboutSettingsSection.module.scss';
import {
    ABOUT_AUTHOR_NAME,
    ABOUT_COPYRIGHT,
    ABOUT_LINKS,
} from './constants';

interface AboutSettingsSectionProps {
    dismissRequestId?: number;
}

export function AboutSettingsSection({dismissRequestId = 0}: AboutSettingsSectionProps) {
    const {settings} = useSettings();
    const locale = settings.locale;
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const sectionClassName = clsx(panelStyles.section);

    useEffect(() => {
        setIsHelpOpen(false);
    }, [dismissRequestId]);

    return (
        <section className={sectionClassName}>
            <h3>{t(locale, 'settingsAbout')}</h3>
            <div className={styles.sectionCard}>
                <div className={styles.identityRow}>
                    <img className={styles.appIcon} src={appIconUrl} alt="" aria-hidden />
                    <div className={styles.identityText}>
                        <p className={styles.appName}>{t(locale, 'settingsAboutAppName')}</p>
                        <p className={styles.appDescription}>{t(locale, 'settingsAboutDescription')}</p>
                    </div>
                </div>

                <div className={styles.metaList}>
                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>{t(locale, 'settingsAboutAuthorLabel')}</span>
                        <span className={styles.metaValue}>{ABOUT_AUTHOR_NAME}</span>
                    </div>
                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>{t(locale, 'settingsAboutCopyrightLabel')}</span>
                        <span className={styles.metaValue}>{ABOUT_COPYRIGHT}</span>
                    </div>
                </div>

                <div className={styles.actionRow}>
                    {ABOUT_LINKS.map(link => (
                        <a
                            key={link.href}
                            className={styles.actionButton}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {link.labelKey === 'settingsAboutGithub' ? (
                                <ExternalLink size={15} strokeWidth={2} aria-hidden />
                            ) : (
                                <BookOpenText size={15} strokeWidth={2} aria-hidden />
                            )}
                            <span>{t(locale, link.labelKey)}</span>
                        </a>
                    ))}
                    <button
                        type="button"
                        className={styles.actionButton}
                        onClick={() => setIsHelpOpen(currentState => !currentState)}
                        aria-haspopup="dialog"
                        aria-expanded={isHelpOpen}
                    >
                        <CircleHelp size={15} strokeWidth={2} aria-hidden />
                        <span>{t(locale, 'keyboardHelpButton')}</span>
                    </button>
                </div>

                {isHelpOpen ? (
                    <div className={styles.helpPanel} role="dialog" aria-modal="false" aria-label={t(locale, 'keyboardHelpTitle')}>
                        <div className={styles.helpHeader}>
                            <h4 className={styles.helpTitle}>{t(locale, 'keyboardHelpTitle')}</h4>
                            <button
                                type="button"
                                className={styles.actionButton}
                                onClick={() => setIsHelpOpen(false)}
                                aria-label={t(locale, 'close')}
                            >
                                {t(locale, 'close')}
                            </button>
                        </div>

                        <ul className={styles.shortcutList}>
                            {KEYBOARD_SHORTCUTS.map(shortcut => (
                                <li key={shortcut.id} className={styles.shortcutItem}>
                                    <span className={styles.shortcutKeys} aria-hidden>
                                        {shortcut.keys.map(key => (
                                            <span key={`${shortcut.id}-${key}`} className={styles.shortcutKey}>
                                                {key}
                                            </span>
                                        ))}
                                    </span>
                                    <span className={styles.shortcutDescription}>{t(locale, shortcut.descriptionKey)}</span>
                                </li>
                            ))}
                        </ul>

                        <p className={styles.helpHint}>{t(locale, 'keyboardHelpInputHint')}</p>
                    </div>
                ) : null}
            </div>
        </section>
    );
}
