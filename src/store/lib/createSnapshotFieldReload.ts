import {replaceSnapshotField} from './snapshotMutations';
import type {DashboardStore} from '../types';
import type {Snapshot} from '@/data';

type StoreSetter = (
    partial: Partial<DashboardStore> | ((state: DashboardStore) => Partial<DashboardStore>),
    replace?: false,
) => void;

export function createSnapshotFieldReload<TKey extends keyof Snapshot>(
    set: StoreSetter,
    key: TKey,
    read: () => Promise<Snapshot[TKey]>,
) {
    return async () => {
        const value = await read();

        replaceSnapshotField(set, key, value);

        return value;
    };
}
