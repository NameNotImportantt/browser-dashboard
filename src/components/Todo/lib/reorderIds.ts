export function reorderIds(ids: string[], fromId: string, toId: string) {
    if (fromId === toId) {
        return ids;
    }

    const fromIndex = ids.indexOf(fromId);
    const toIndex = ids.indexOf(toId);

    if (fromIndex === -1 || toIndex === -1) {
        return ids;
    }

    const draft = [...ids];
    const [moved] = draft.splice(fromIndex, 1);

    if (moved === undefined) {
        return ids;
    }

    draft.splice(toIndex, 0, moved);

    return draft;
}
