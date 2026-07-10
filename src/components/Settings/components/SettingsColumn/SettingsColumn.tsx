import type {ReactNode} from 'react';
import {SettingsSectionHeader} from '../SettingsSectionHeader';
import styles from './SettingsColumn.module.scss';
import type {LucideIcon} from 'lucide-react';

interface SettingsColumnProps {
    title: string;
    icon?: LucideIcon;
    children: ReactNode;
}

export function SettingsColumn({title, icon, children}: SettingsColumnProps) {
    return (
        <section className={styles.root}>
            <SettingsSectionHeader title={title} icon={icon} />
            {children}
        </section>
    );
}
