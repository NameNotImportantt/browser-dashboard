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

    return (
        <nav className={styles.screenMenu} aria-label={t(locale, 'screenNavAriaLabel')}>
            {SCREENS.map(screen => {
                const isActive = screen.id === activeScreen;

                const Icon = screen.icon;

                return (
                    <button
                        key={screen.id}
                        type="button"
                        className={`${Icon ? styles.iconButton : ''} ${isActive ? styles.isActive : ''}`.trim() || undefined}
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
                className={`${styles.iconButton} ${isSettingsActive ? styles.isActive : ''}`}
                aria-current={isSettingsActive ? 'page' : undefined}
                aria-label={t(locale, 'settings')}
                onClick={() => onSelect('settings')}
            >
                <Settings size={16} strokeWidth={2.25} />
            </button>
        </nav>
    );
}
