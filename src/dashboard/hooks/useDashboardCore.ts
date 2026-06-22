import {useDashboardStore} from '@/store';

export function useDashboardCore() {
    const loading = useDashboardStore(dashboardStore => dashboardStore.loading);
    const error = useDashboardStore(dashboardStore => dashboardStore.error);
    const init = useDashboardStore(dashboardStore => dashboardStore.init);
    const refresh = useDashboardStore(dashboardStore => dashboardStore.refresh);

    return {loading, error, init, refresh};
}
