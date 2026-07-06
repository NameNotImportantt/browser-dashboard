type WorkspaceScopedItem = {
    workspaceId: string;
};

type PositionedWorkspaceScopedItem = WorkspaceScopedItem & {
    position: number;
};

export function selectWorkspaceScopedItems<TItem extends WorkspaceScopedItem>(
    items: TItem[],
    activeWorkspaceId: string | null,
) {
    if (!activeWorkspaceId) {
        return [];
    }

    return items.filter(item => item.workspaceId === activeWorkspaceId);
}

export function selectSortedWorkspaceScopedItems<TItem extends PositionedWorkspaceScopedItem>(
    items: TItem[],
    activeWorkspaceId: string | null,
) {
    return selectWorkspaceScopedItems(items, activeWorkspaceId)
        .slice()
        .sort((firstItem, secondItem) => firstItem.position - secondItem.position);
}
