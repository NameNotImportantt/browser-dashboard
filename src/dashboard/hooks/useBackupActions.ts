import {useState} from 'react';
import {createDashboardBackupDownloadPayload} from '@/data';
import {useSettings} from './useSettings';

export function useBackupActions() {
    const {setLastBackupExportedAt} = useSettings();
    const [isExporting, setIsExporting] = useState(false);

    const exportBackup = async () => {
        setIsExporting(true);

        try {
            const payload = await createDashboardBackupDownloadPayload();
            const objectUrl = URL.createObjectURL(payload.blob);

            try {
                const anchor = document.createElement('a');

                anchor.href = objectUrl;
                anchor.download = payload.fileName;
                anchor.click();
            } finally {
                URL.revokeObjectURL(objectUrl);
            }

            await setLastBackupExportedAt(payload.exportedAt);
            return true;
        } finally {
            setIsExporting(false);
        }
    };

    return {
        exportBackup,
        isExporting,
    };
}
