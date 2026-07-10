import type {ReactNode} from 'react';
import {SettingsSectionHeader} from '../SettingsSectionHeader';
import styles from './SettingsSubsection.module.scss';

interface SettingsSubsectionProps {
    title: string;
    showDivider?: boolean;
    children: ReactNode;
}

export function SettingsSubsection({title, showDivider = false, children}: SettingsSubsectionProps) {
    return (
        <div className={styles.root}>
            {showDivider ? <div className={styles.divider} role="separator" aria-hidden /> : null}
            <SettingsSectionHeader title={title} compact />
            <div className={styles.content}>{children}</div>
        </div>
    );
}
