import {useEffect, useState, type ChangeEvent} from 'react';
import clsx from 'clsx';
import {t} from '@/app';
import {Modal} from '@/components';
import {useDashboardCore, useSettings} from '@/dashboard';
import {DashboardBackupError} from '@/data';
import panelStyles from '../../SettingsPanel.module.scss';
import styles from './BackupSettingsSection.module.scss';

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
    const {settings} = useSettings();
    const {importDashboardBackupJson} = useDashboardCore();
    const locale = settings.locale;
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const dangerButtonClassName = clsx(panelStyles.dangerButton);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.item(0) ?? null;

        setSelectedFile(file);
        setErrorMessage(null);
        setIsConfirmOpen(false);
        event.target.value = '';
    };

    const handleImport = async () => {
        if (!selectedFile) {
            return;
        }

        setIsImporting(true);
        setErrorMessage(null);

        try {
            const json = await selectedFile.text();

            await importDashboardBackupJson(json);
            setSelectedFile(null);
            setIsConfirmOpen(false);
        } catch (error) {
            if (error instanceof DashboardBackupError) {
                setErrorMessage(t(locale, getBackupImportErrorMessageKey(error.code)));
            } else {
                setErrorMessage(t(locale, 'backupImportFailed'));
            }
        } finally {
            setIsImporting(false);
        }
    };

    useEffect(() => {
        setSelectedFile(null);
        setIsConfirmOpen(false);
        setIsImporting(false);
        setErrorMessage(null);
    }, [dismissRequestId]);

    const sectionCardClassName = clsx(
        styles.sectionCard,
        embedded ? styles.sectionCardEmbedded : null,
    );

    const content = (
        <>
            {embedded ? <h4 className={styles.embeddedTitle}>{t(locale, 'settingsBackup')}</h4> : null}
            <div className={sectionCardClassName}>
                <div className={panelStyles.field}>
                    <span className={panelStyles.fieldLabel}>{t(locale, 'backupImport')}</span>
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
                        {isImporting ? t(locale, 'backupImporting') : t(locale, 'confirmImport')}
                    </button>
                </div>

                {selectedFile ? (
                    <div className={styles.fileSummary}>
                        <small className={panelStyles.hint}>{t(locale, 'backupFileSelected')}</small>
                        <small className={styles.fileName}>{selectedFile.name}</small>
                    </div>
                ) : null}

                {errorMessage ? <small className={panelStyles.error}>{errorMessage}</small> : null}
            </div>
        </>
    );

    return (
        <>
            {!embedded ? (
                <section className={panelStyles.section}>
                    <h3>{t(locale, 'settingsBackup')}</h3>
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
                    actions={(
                        <button
                            type="button"
                            className={dangerButtonClassName}
                            onClick={() => void handleImport()}
                            disabled={isImporting}
                        >
                            {isImporting ? t(locale, 'backupImporting') : t(locale, 'confirmImport')}
                        </button>
                    )}
                >
                    <div className={styles.modalCopy}>
                        <p>{t(locale, 'backupImportConfirmMessage')}</p>
                        <p className={styles.warningText}>{t(locale, 'backupImportConfirmWarning')}</p>
                        {selectedFile ? <small className={panelStyles.hint}>{selectedFile.name}</small> : null}
                        {errorMessage ? <small className={panelStyles.error}>{errorMessage}</small> : null}
                    </div>
                </Modal>
            ) : null}
        </>
    );
}
