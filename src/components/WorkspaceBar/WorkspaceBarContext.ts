import {createContext, useContext} from 'react';
import type {AppLocale, Workspace} from '@/db';

interface WorkspaceBarContextValue {
    activeWorkspaceId: string | null;
    canDeleteWorkspaces: boolean;
    editingWorkspaceId: string | null;
    hoveredWorkspaceId: string | null;
    locale: AppLocale;
    renameName: string;
    workspaceError: string | null;
    onDeleteRequest: (workspaceId: string) => void;
    onHoverChange: (workspaceId: string | null) => void;
    onRenameCancel: () => void;
    onRenameCommit: (workspace: Workspace) => Promise<void>;
    onRenameNameChange: (value: string) => void;
    onRenameStart: (workspace: Workspace) => void;
    onSelect: (workspaceId: string) => Promise<void>;
}

const workspaceBarContext = createContext<WorkspaceBarContextValue | null>(null);

export const WorkspaceBarContextProvider = workspaceBarContext.Provider;

export function useWorkspaceBarContext() {
    const context = useContext(workspaceBarContext);

    if (!context) {
        throw new Error('WorkspaceBarContext is not available');
    }

    return context;
}
