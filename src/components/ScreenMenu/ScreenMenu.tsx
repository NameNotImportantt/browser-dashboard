import clsx from 'clsx';
import {Settings} from 'lucide-react';
import {t} from '@/app';
import {SCREENS} from './constants';
import styles from './ScreenMenu.module.scss';
import type {AppLocale} from '@/db';

export type ScreenId = 'home' | 'todo' | 'habits' | 'notes' | 'settings';

export interface ScreenMenuProps {
  activeScreen: ScreenId;
  locale: AppLocale;
  onSelect: (screen: ScreenId) => void;
}

export function ScreenMenu({activeScreen, locale, onSelect}: ScreenMenuProps) {
    const isSettingsActive = activeScreen === 'settings';
    const settingsButtonClassName = clsx(styles.menuButton, styles.iconButton, {[styles.isActive]: isSettingsActive});

    return (
        <nav className={styles.screenMenu} aria-label={t(locale, 'screenNavAriaLabel')}>
            {SCREENS.map(screen => {
                const isActive = screen.id === activeScreen;

                const Icon = screen.icon;

                const screenButtonClassName = clsx(styles.menuButton, Icon ? styles.iconButton : styles.textButton, {
                    [styles.isActive]: isActive,
                });

                return (
                    <button
                        key={screen.id}
                        type="button"
                        className={screenButtonClassName}
                        aria-current={isActive ? 'page' : undefined}
                        aria-label={Icon ? t(locale, screen.labelKey) : undefined}
                        onClick={() => onSelect(screen.id)}
                    >
                        {Icon ? <Icon size={16} strokeWidth={2.25} /> : t(locale, screen.labelKey)}
                    </button>
                );
            })}

            <button
                type="button"
                className={settingsButtonClassName}
                aria-current={isSettingsActive ? 'page' : undefined}
                aria-label={t(locale, 'settings')}
                onClick={() => onSelect('settings')}
            >
                <Settings size={16} strokeWidth={2.25} />
            </button>
        </nav>
    );
}
