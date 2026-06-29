import clsx from 'clsx';
import styles from './SettingsSectionHeader.module.scss';
import type {LucideIcon} from 'lucide-react';

interface SettingsSectionHeaderProps {
    title: string;
    icon?: LucideIcon;
    compact?: boolean;
}

export function SettingsSectionHeader({title, icon: Icon, compact = false}: SettingsSectionHeaderProps) {
    const rootClassName = clsx(styles.root, compact ? styles.compact : null);

    return (
        <div className={rootClassName}>
            {Icon ? (
                <span className={styles.icon} aria-hidden>
                    <Icon size={compact ? 14 : 16} strokeWidth={2.2} />
                </span>
            ) : null}
            <h3 className={styles.title}>{title}</h3>
        </div>
    );
}
