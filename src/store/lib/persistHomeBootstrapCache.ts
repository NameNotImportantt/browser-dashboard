import {saveHomeBootstrapSnapshot} from '@/data';
import type {DashboardStore} from '../types';

type StoreGetter = () => DashboardStore;

export async function persistHomeBootstrapCache(get: StoreGetter) {
    const {snapshot, activeWorkspaceId} = get();

    if (!snapshot) {
        return;
    }

    await saveHomeBootstrapSnapshot(snapshot, activeWorkspaceId);
}
