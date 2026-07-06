import {sortByPosition, type Snapshot} from '@/data';
import type {DashboardStore} from '../types';

type StoreSetter = (
    partial: Partial<DashboardStore> | ((state: DashboardStore) => Partial<DashboardStore>),
    replace?: false,
) => void;

type SnapshotCollectionKey =
    | 'workspaces'
    | 'todos'
    | 'habits'
    | 'bookmarks'
    | 'bookmarkCategories'
    | 'notes'
    | 'searchHistory';

type PositionedSnapshotCollectionKey =
    | 'workspaces'
    | 'todos'
    | 'habits'
    | 'bookmarks'
    | 'bookmarkCategories'
    | 'notes';

type SnapshotCollectionItem<TKey extends SnapshotCollectionKey> = Snapshot[TKey][number];

export function patchSnapshot(set: StoreSetter, updater: (snapshot: Snapshot) => Snapshot) {
    set(state => {
        if (!state.snapshot) {
            return {};
        }

        return {
            snapshot: updater(state.snapshot),
        };
    });
}

export function replaceSnapshotField<TKey extends keyof Snapshot>(
    set: StoreSetter,
    key: TKey,
    value: Snapshot[TKey],
) {
    patchSnapshot(set, snapshot => ({
        ...snapshot,
        [key]: value,
    }));
}

export function patchSnapshotCollection<TKey extends SnapshotCollectionKey>(
    set: StoreSetter,
    key: TKey,
    updater: (items: Snapshot[TKey]) => Snapshot[TKey],
) {
    patchSnapshot(set, snapshot => ({
        ...snapshot,
        [key]: updater(snapshot[key]),
    }));
}

export function appendSnapshotCollectionItem<TKey extends SnapshotCollectionKey>(
    set: StoreSetter,
    key: TKey,
    item: SnapshotCollectionItem<TKey>,
) {
    patchSnapshotCollection(set, key, items => [...items, item] as Snapshot[TKey]);
}

export function appendSortedSnapshotCollectionItem<TKey extends PositionedSnapshotCollectionKey>(
    set: StoreSetter,
    key: TKey,
    item: SnapshotCollectionItem<TKey>,
) {
    patchSnapshotCollection(set, key, items => sortByPosition([...items, item]) as Snapshot[TKey]);
}

export function mapSnapshotCollectionItem<TKey extends SnapshotCollectionKey>(
    set: StoreSetter,
    key: TKey,
    itemId: string,
    updater: (item: SnapshotCollectionItem<TKey>) => SnapshotCollectionItem<TKey>,
) {
    patchSnapshotCollection(
        set,
        key,
        items => items.map(item => (item.id === itemId ? updater(item) : item)) as Snapshot[TKey],
    );
}

export function removeSnapshotCollectionItem<TKey extends SnapshotCollectionKey>(
    set: StoreSetter,
    key: TKey,
    itemId: string,
) {
    patchSnapshotCollection(set, key, items => items.filter(item => item.id !== itemId) as Snapshot[TKey]);
}
