import {useDashboardStore} from '@/store';

export function useDashboardCore() {
    const loading = useDashboardStore(dashboardStore => dashboardStore.loading);
    const error = useDashboardStore(dashboardStore => dashboardStore.error);
    const init = useDashboardStore(dashboardStore => dashboardStore.init);
    const refresh = useDashboardStore(dashboardStore => dashboardStore.refresh);
    const importDashboardBackupJson = useDashboardStore(dashboardStore => dashboardStore.importDashboardBackupJson);

    return {loading, error, init, refresh, importDashboardBackupJson};
}
