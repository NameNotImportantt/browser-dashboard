import {useEffect, useState, type FormEvent} from 'react';
import {useFieldValidation} from '@/components';
import {useSettings, useWorkspaces} from '@/dashboard';
import {t} from '@/i18n';
import type {Workspace} from '@/db';

interface UseWorkspaceBarControllerOptions {
    dismissRequestId: number;
}

export function useWorkspaceBarController({dismissRequestId}: UseWorkspaceBarControllerOptions) {
    const {workspaces, activeWorkspaceId, selectWorkspace, addWorkspace, renameWorkspace, deleteWorkspace} = useWorkspaces();
    const {locale} = useSettings();
    const [editingWorkspaceId, setEditingWorkspaceId] = useState<string | null>(null);
    const [hoveredWorkspaceId, setHoveredWorkspaceId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [name, setName] = useState('');
    const [pendingDeleteWorkspaceId, setPendingDeleteWorkspaceId] = useState<string | null>(null);
    const [renameName, setRenameName] = useState('');
    const addWorkspaceValidation = useFieldValidation();
    const renameWorkspaceValidation = useFieldValidation();

    const canDeleteWorkspaces = workspaces.length > 1;
    const pendingDeleteWorkspace = workspaces.find(workspace => workspace.id === pendingDeleteWorkspaceId) ?? null;

    const resetAllWorkspaceValidation = () => {
        addWorkspaceValidation.reset();
        renameWorkspaceValidation.reset();
    };

    const cancelRenameWorkspace = () => {
        setEditingWorkspaceId(null);
        setRenameName('');
        renameWorkspaceValidation.reset();
    };

    const handleAddWorkspaceNameChange = (value: string) => {
        setName(value);
        addWorkspaceValidation.clearError();
    };

    const handleAddWorkspaceCancel = () => {
        setIsAdding(false);
        addWorkspaceValidation.reset();
    };

    const handleAddWorkspaceSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const value = name.trim();

        if (!value) {
            addWorkspaceValidation.markSubmitted();
            addWorkspaceValidation.setError(t(locale, 'workspaceNameRequired'));
            return;
        }

        await addWorkspace(value);
        setName('');
        addWorkspaceValidation.reset();
        setIsAdding(false);
    };

    const handleWorkspaceHover = (workspaceId: string | null) => {
        setHoveredWorkspaceId(workspaceId);
    };

    const handleWorkspaceSelect = async (workspaceId: string) => {
        await selectWorkspace(workspaceId);
    };

    const handleRenameWorkspaceStart = (workspace: Workspace) => {
        setEditingWorkspaceId(workspace.id);
        setRenameName(workspace.name);
        renameWorkspaceValidation.reset();
        setIsAdding(false);
        setPendingDeleteWorkspaceId(null);
    };

    const handleRenameWorkspaceNameChange = (value: string) => {
        setRenameName(value);
        renameWorkspaceValidation.clearError();
    };

    const handleRenameWorkspaceCommit = async (workspace: Workspace) => {
        const value = renameName.trim();

        if (!value) {
            renameWorkspaceValidation.markSubmitted();
            renameWorkspaceValidation.setError(t(locale, 'workspaceNameRequired'));
            return;
        }

        if (value === workspace.name) {
            cancelRenameWorkspace();
            return;
        }

        await renameWorkspace(workspace.id, value);
        cancelRenameWorkspace();
    };

    const handleDeleteWorkspaceRequest = (workspaceId: string) => {
        setPendingDeleteWorkspaceId(workspaceId);
    };

    const handleDeleteWorkspaceCancel = () => {
        setPendingDeleteWorkspaceId(null);
    };

    const handleDeleteWorkspaceConfirm = async () => {
        if (!pendingDeleteWorkspace) {
            return;
        }

        await deleteWorkspace(pendingDeleteWorkspace.id);
        setPendingDeleteWorkspaceId(null);
    };

    const handleStartAddingWorkspace = () => {
        setIsAdding(true);
        setEditingWorkspaceId(null);
        setPendingDeleteWorkspaceId(null);
        addWorkspaceValidation.reset();
        renameWorkspaceValidation.reset();
    };

    useEffect(() => {
        setEditingWorkspaceId(null);
        setHoveredWorkspaceId(null);
        setIsAdding(false);
        setPendingDeleteWorkspaceId(null);
        setName('');
        setRenameName('');
        resetAllWorkspaceValidation();
    }, [dismissRequestId]);

    useEffect(() => {
        if (editingWorkspaceId && !workspaces.some(workspace => workspace.id === editingWorkspaceId)) {
            cancelRenameWorkspace();
        }

        if (pendingDeleteWorkspaceId && !workspaces.some(workspace => workspace.id === pendingDeleteWorkspaceId)) {
            setPendingDeleteWorkspaceId(null);
        }
    }, [editingWorkspaceId, pendingDeleteWorkspaceId, workspaces]);

    return {
        activeWorkspaceId,
        addWorkspaceValidation,
        canDeleteWorkspaces,
        editingWorkspaceId,
        handleAddWorkspaceCancel,
        handleAddWorkspaceNameChange,
        handleAddWorkspaceSubmit,
        handleDeleteWorkspaceCancel,
        handleDeleteWorkspaceConfirm,
        handleDeleteWorkspaceRequest,
        handleRenameWorkspaceCommit,
        handleRenameWorkspaceNameChange,
        handleRenameWorkspaceStart,
        handleStartAddingWorkspace,
        handleWorkspaceHover,
        handleWorkspaceSelect,
        hoveredWorkspaceId,
        isAdding,
        locale,
        name,
        pendingDeleteWorkspace,
        renameName,
        renameWorkspaceValidation,
        workspaces,
        onRenameCancel: cancelRenameWorkspace,
    };
}
