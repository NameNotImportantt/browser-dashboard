import clsx from 'clsx';
import {useBackupActions, useSettings} from '@/dashboard';
import {t} from '@/i18n';
import styles from './BackupReminderCard.module.scss';

interface BackupReminderCardProps {
    onOpenSettings: () => void;
}

export function BackupReminderCard({onOpenSettings}: BackupReminderCardProps) {
    const {locale} = useSettings();
    const {exportBackup, isExporting} = useBackupActions();
    const secondaryButtonClassName = clsx(styles.secondaryButton);
    const actionButtonClassName = clsx(styles.actionButton);

    return (
        <section className={clsx('card', styles.reminderCard)} aria-label={t(locale, 'backupReminderHomeTitle')}>
            <div className={styles.content}>
                <div className={styles.copy}>
                    <h2 className={styles.title}>{t(locale, 'backupReminderHomeTitle')}</h2>
                    <p className={styles.body}>{t(locale, 'backupReminderHomeBody')}</p>
                </div>

                <div className={styles.actions}>
                    <button
                        type="button"
                        className={actionButtonClassName}
                        onClick={() => void exportBackup()}
                        disabled={isExporting}
                    >
                        {isExporting ? t(locale, 'backupExporting') : t(locale, 'backupExport')}
                    </button>
                    <button
                        type="button"
                        className={clsx(actionButtonClassName, secondaryButtonClassName)}
                        onClick={onOpenSettings}
                    >
                        {t(locale, 'openSettings')}
                    </button>
                </div>
            </div>
        </section>
    );
}
