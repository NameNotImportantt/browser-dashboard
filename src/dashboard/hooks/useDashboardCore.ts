import {useDashboardStore} from '@/store';

export function useDashboardCore() {
    const loading = useDashboardStore(dashboardStore => dashboardStore.loading);
    const deferredLoading = useDashboardStore(dashboardStore => dashboardStore.deferredLoading);
    const deferredReady = useDashboardStore(dashboardStore => dashboardStore.deferredReady);
    const error = useDashboardStore(dashboardStore => dashboardStore.error);
    const init = useDashboardStore(dashboardStore => dashboardStore.init);
    const hydrateDeferredData = useDashboardStore(dashboardStore => dashboardStore.hydrateDeferredData);
    const refresh = useDashboardStore(dashboardStore => dashboardStore.refresh);
    const importDashboardBackupJson = useDashboardStore(dashboardStore => dashboardStore.importDashboardBackupJson);

    return {loading, deferredLoading, deferredReady, error, init, hydrateDeferredData, refresh, importDashboardBackupJson};
}
