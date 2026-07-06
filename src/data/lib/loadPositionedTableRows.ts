import type {Table} from 'dexie';

export async function loadPositionedTableRows<TItem extends { position: number }>(table: Table<TItem, string>) {
    return table.orderBy('position').toArray();
}
