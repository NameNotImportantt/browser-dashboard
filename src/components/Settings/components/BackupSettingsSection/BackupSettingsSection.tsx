import {useEffect, useState, type ChangeEvent} from 'react';
import clsx from 'clsx';
import {ActionStatus, FieldMessage, getFieldMessageProps, Loader, Modal} from '@/components';
import {Checkbox} from '@/components/Checkbox';
import {useBackupActions, useDashboardCore, useSettings} from '@/dashboard';
import {DashboardBackupError} from '@/data';
import {isBackupReminderOverdue} from '@/data/settings';
import {useActionStatus} from '@/hooks/useActionStatus';
import {t} from '@/i18n';
import panelStyles from '../../SettingsPanel.module.scss';
import {SettingsSectionHeader} from '../SettingsSectionHeader';
import styles from './BackupSettingsSection.module.scss';
import {useBackupReminderIntervalField} from './hooks/useBackupReminderIntervalField';

interface BackupSettingsSectionProps {
    dismissRequestId?: number;
    embedded?: boolean;
}

function getBackupImportErrorMessageKey(code: DashboardBackupError['code']) {
    switch (code) {
        case 'invalidJson':
            return 'backupImportInvalidJson';
        case 'invalidEnvelope':
            return 'backupImportInvalidEnvelope';
        case 'unsupportedSchemaVersion':
            return 'backupImportUnsupportedSchema';
        case 'importFailed':
        default:
            return 'backupImportFailed';
    }
}

export function BackupSettingsSection({dismissRequestId = 0, embedded = false}: BackupSettingsSectionProps) {
    const {
        settings,
        setBackupReminderEnabled,
        setBackupReminderIntervalDays,
    } = useSettings();

    const {importDashboardBackupJson} = useDashboardCore();
    const {exportBackup, isExporting} = useBackupActions();
    const locale = settings.locale;
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const exportStatus = useActionStatus();
    const importStatus = useActionStatus();
    const dangerButtonClassName = clsx(panelStyles.dangerButton);
    const backupReminderOverdue = isBackupReminderOverdue(settings);

    const {
        draft: intervalDaysDraft,
        error: intervalDaysError,
        handleBlur: handleIntervalDaysBlur,
        handleChange: handleIntervalDaysChange,
    } = useBackupReminderIntervalField({
        locale,
        value: settings.backupReminderIntervalDays,
        onCommit: setBackupReminderIntervalDays,
    });
    const intervalDaysFieldValidation = getFieldMessageProps({
        error: intervalDaysError,
        hasHint: true,
        id: 'backup-reminder-interval-days',
    });

    const formatDateTime = (value: number) => new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'ru-RU', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.item(0) ?? null;

        setSelectedFile(file);
        importStatus.reset();
        setIsConfirmOpen(false);
        event.target.value = '';
    };

    const handleImport = async () => {
        if (!selectedFile) {
            return;
        }

        setIsImporting(true);
        importStatus.start();

        try {
            const json = await selectedFile.text();

            await importDashboardBackupJson(json);
            setSelectedFile(null);
            setIsConfirmOpen(false);
            importStatus.succeed(t(locale, 'backupImportSuccess'));
        } catch (error) {
            if (error instanceof DashboardBackupError) {
                importStatus.fail(t(locale, getBackupImportErrorMessageKey(error.code)));
            } else {
                importStatus.fail(t(locale, 'backupImportFailed'));
            }
        } finally {
            setIsImporting(false);
        }
    };

    const handleExport = async () => {
        exportStatus.start();

        try {
            await exportBackup();
            exportStatus.succeed(t(locale, 'backupExportSuccess'));
        } catch {
            exportStatus.fail(t(locale, 'backupExportFailed'));
        }
    };

    useEffect(() => {
        setSelectedFile(null);
        setIsConfirmOpen(false);
        setIsImporting(false);
        exportStatus.reset();
        importStatus.reset();
    }, [dismissRequestId]);

    const sectionCardClassName = clsx(
        styles.sectionCard,
        embedded ? styles.sectionCardEmbedded : null,
    );

    const isBusy = isExporting || isImporting;

    const content = (
        <>
            {embedded ? <SettingsSectionHeader title={t(locale, 'settingsBackup')} compact /> : null}
            <div className={sectionCardClassName}>
                <div className={panelStyles.field}>
                    <Checkbox
                        checked={settings.backupReminderEnabled}
                        onChange={() => void setBackupReminderEnabled(!settings.backupReminderEnabled)}
                        label={t(locale, 'backupReminderEnabled')}
                    />
                </div>

                {backupReminderOverdue ? (
                    <div className={styles.reminderBanner} role="status" aria-live="polite">
                        <div className={styles.reminderCopy}>
                            <h5 className={styles.reminderTitle}>{t(locale, 'backupReminderSettingsTitle')}</h5>
                            <p className={styles.reminderBody}>{t(locale, 'backupReminderSettingsBody')}</p>
                        </div>
                        <button
                            type="button"
                            className={styles.reminderAction}
                            onClick={() => void handleExport()}
                            disabled={isExporting || isImporting}
                        >
                            {t(locale, 'backupExport')}
                        </button>
                        {isExporting ? (
                            <Loader
                                className={styles.bannerLoader}
                                label={t(locale, 'backupExporting')}
                                tone="inline"
                            />
                        ) : null}
                    </div>
                ) : null}

                <h5 className={styles.minorTitle}>{t(locale, 'backupReminderIntervalDays')}</h5>
                <label className={panelStyles.field}>
                    <div className={styles.inlineRow}>
                        <input
                            className={clsx(styles.intervalInput, intervalDaysError ? styles.intervalInputInvalid : null)}
                            type="number"
                            min={1}
                            max={365}
                            step={1}
                            value={intervalDaysDraft}
                            onChange={handleIntervalDaysChange}
                            onBlur={handleIntervalDaysBlur}
                            {...intervalDaysFieldValidation.inputProps}
                        />
                        <span className={styles.inputSuffix}>{t(locale, 'days')}</span>
                    </div>
                    <FieldMessage
                        className={panelStyles.hint}
                        id={intervalDaysFieldValidation.hintId}
                    >
                        {t(locale, 'backupReminderIntervalHint')}
                    </FieldMessage>
                    <FieldMessage
                        ariaLive="polite"
                        className={panelStyles.error}
                        id={intervalDaysFieldValidation.errorId}
                    >
                        {intervalDaysError}
                    </FieldMessage>
                </label>

                <div className={panelStyles.field}>
                    <span className={panelStyles.fieldLabel}>{t(locale, 'backupLastExportedAt')}</span>
                    <small className={styles.statusText}>
                        {settings.lastBackupExportedAt === null
                            ? t(locale, 'backupLastExportedNever')
                            : formatDateTime(settings.lastBackupExportedAt)}
                    </small>
                    <small className={backupReminderOverdue ? panelStyles.error : panelStyles.hint}>
                        {backupReminderOverdue ? t(locale, 'backupReminderOverdue') : t(locale, 'backupReminderCurrent')}
                    </small>
                </div>

                <h5 className={styles.minorTitle}>{t(locale, 'backupExport')}</h5>
                <div className={panelStyles.field}>
                    <small className={panelStyles.hint}>{t(locale, 'backupExportHint')}</small>
                </div>

                <div className={styles.actionRow}>
                    <button type="button" onClick={() => void handleExport()} disabled={isExporting || isImporting}>
                        {t(locale, 'backupExport')}
                    </button>
                </div>
                <ActionStatus
                    className={styles.actionStatus}
                    status={exportStatus.status}
                    message={exportStatus.message}
                    pendingLabel={t(locale, 'backupExporting')}
                />

                <h5 className={styles.minorTitle}>{t(locale, 'backupImport')}</h5>
                <div className={panelStyles.field}>
                    <small className={panelStyles.hint}>{t(locale, 'backupImportHint')}</small>
                </div>

                <div className={styles.actionRow}>
                    <label className={styles.fileButton}>
                        <input
                            type="file"
                            accept="application/json,.json"
                            className={panelStyles.hiddenInput}
                            onChange={handleFileChange}
                        />
                        <span>{t(locale, 'chooseBackupFile')}</span>
                    </label>

                    <button
                        type="button"
                        className={dangerButtonClassName}
                        onClick={() => setIsConfirmOpen(true)}
                        disabled={!selectedFile || isImporting}
                    >
                        {t(locale, 'confirmImport')}
                    </button>
                </div>
                <ActionStatus
                    className={styles.actionStatus}
                    status={importStatus.status}
                    message={importStatus.message}
                    pendingLabel={t(locale, 'backupImporting')}
                />

                {selectedFile ? (
                    <div className={styles.fileSummary}>
                        <small className={panelStyles.hint}>{t(locale, 'backupFileSelected')}</small>
                        <small className={styles.fileName}>{selectedFile.name}</small>
                    </div>
                ) : null}
            </div>
        </>
    );

    return (
        <>
            {!embedded ? (
                <section className={panelStyles.section}>
                    <SettingsSectionHeader title={t(locale, 'settingsBackup')} />
                    {content}
                </section>
            ) : content}
            {isConfirmOpen ? (
                <Modal
                    open={isConfirmOpen}
                    title={t(locale, 'backupImportConfirmTitle')}
                    onClose={() => {
                        if (!isImporting) {
                            setIsConfirmOpen(false);
                        }
                    }}
                    closeLabel={t(locale, 'cancel')}
                    confirmLabel={t(locale, 'confirmImport')}
                    onConfirm={() => void handleImport()}
                    confirmDisabled={isImporting}
                    confirmButtonClassName={dangerButtonClassName}
                    showCloseIcon
                >
                    <div className={styles.modalCopy}>
                        <p>{t(locale, 'backupImportConfirmMessage')}</p>
                        <p className={styles.warningText}>{t(locale, 'backupImportConfirmWarning')}</p>
                        {selectedFile ? <small className={panelStyles.hint}>{selectedFile.name}</small> : null}
                        {isBusy ? (
                            <Loader
                                className={styles.modalLoader}
                                label={isImporting ? t(locale, 'backupImporting') : t(locale, 'backupExporting')}
                                tone="inline"
                            />
                        ) : null}
                        {importStatus.status === 'error' && importStatus.message ? (
                            <small className={panelStyles.error}>{importStatus.message}</small>
                        ) : null}
                    </div>
                </Modal>
            ) : null}
        </>
    );
}
