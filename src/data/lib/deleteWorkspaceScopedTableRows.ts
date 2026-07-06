import type {Table} from 'dexie';

export async function deleteWorkspaceScopedTableRows<TItem extends { workspaceId: string }>(
    table: Table<TItem, string>,
    workspaceId: string,
) {
    await table.where('workspaceId').equals(workspaceId).delete();
}
