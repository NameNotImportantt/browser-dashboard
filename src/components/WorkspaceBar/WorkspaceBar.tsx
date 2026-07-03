import {useEffect, useState, type FormEvent} from 'react';
import clsx from 'clsx';
import {Modal} from '@/components/Modal';
import {useSettings, useWorkspaces} from '@/dashboard';
import {t} from '@/i18n';
import {AddWorkspaceForm} from './components/AddWorkspaceForm/AddWorkspaceForm';
import {WorkspaceItem} from './components/WorkspaceItem/WorkspaceItem';
import styles from './WorkspaceBar.module.scss';
import {WorkspaceBarContextProvider} from './WorkspaceBarContext';
import type {Workspace} from '@/db';

interface WorkspaceBarProps {
    dismissRequestId?: number;
}

export function WorkspaceBar({dismissRequestId = 0}: WorkspaceBarProps) {
    const {workspaces, activeWorkspaceId, selectWorkspace, addWorkspace, renameWorkspace, deleteWorkspace} = useWorkspaces();
    const {locale} = useSettings();
    const [editingWorkspaceId, setEditingWorkspaceId] = useState<string | null>(null);
    const [hoveredWorkspaceId, setHoveredWorkspaceId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [name, setName] = useState('');
    const [pendingDeleteWorkspaceId, setPendingDeleteWorkspaceId] = useState<string | null>(null);
    const [renameName, setRenameName] = useState('');
    const [workspaceError, setWorkspaceError] = useState<string | null>(null);

    const trailingSeparatorClassName = clsx(styles.separator, {
        [styles.separatorHidden]: hoveredWorkspaceId === workspaces[workspaces.length - 1]?.id,
    });

    const canDeleteWorkspaces = workspaces.length > 1;
    const pendingDeleteWorkspace = workspaces.find(workspace => workspace.id === pendingDeleteWorkspaceId) ?? null;

    const resetWorkspaceError = () => {
        setWorkspaceError(null);
    };

    const cancelRenameWorkspace = () => {
        setEditingWorkspaceId(null);
        setRenameName('');
        setWorkspaceError(null);
    };

    const handleAddWorkspaceNameChange = (value: string) => {
        setName(value);
        resetWorkspaceError();
    };

    const handleAddWorkspaceCancel = () => {
        setIsAdding(false);
        resetWorkspaceError();
    };

    const handleAddWorkspaceSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const value = name.trim();

        if (!value) {
            setWorkspaceError(t(locale, 'workspaceNameRequired'));
            return;
        }

        await addWorkspace(value);
        setName('');
        setWorkspaceError(null);
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
        setWorkspaceError(null);
        setIsAdding(false);
        setPendingDeleteWorkspaceId(null);
    };

    const handleRenameWorkspaceNameChange = (value: string) => {
        setRenameName(value);
        resetWorkspaceError();
    };

    const handleRenameWorkspaceCommit = async (workspace: Workspace) => {
        const value = renameName.trim();

        if (!value) {
            setWorkspaceError(t(locale, 'workspaceNameRequired'));
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

    const handleDeleteWorkspaceModalConfirm = () => {
        void handleDeleteWorkspaceConfirm();
    };

    const handleStartAddingWorkspace = () => {
        setIsAdding(true);
        setEditingWorkspaceId(null);
        setPendingDeleteWorkspaceId(null);
        setWorkspaceError(null);
    };

    useEffect(() => {
        setEditingWorkspaceId(null);
        setHoveredWorkspaceId(null);
        setIsAdding(false);
        setPendingDeleteWorkspaceId(null);
        setRenameName('');
        setWorkspaceError(null);
    }, [dismissRequestId]);

    useEffect(() => {
        if (editingWorkspaceId && !workspaces.some(workspace => workspace.id === editingWorkspaceId)) {
            cancelRenameWorkspace();
        }

        if (pendingDeleteWorkspaceId && !workspaces.some(workspace => workspace.id === pendingDeleteWorkspaceId)) {
            setPendingDeleteWorkspaceId(null);
        }
    }, [editingWorkspaceId, pendingDeleteWorkspaceId, workspaces]);

    const workspaceBarContextValue = {
        activeWorkspaceId,
        canDeleteWorkspaces,
        editingWorkspaceId,
        hoveredWorkspaceId,
        locale,
        renameName,
        workspaceError,
        onDeleteRequest: handleDeleteWorkspaceRequest,
        onHoverChange: handleWorkspaceHover,
        onRenameCancel: cancelRenameWorkspace,
        onRenameCommit: handleRenameWorkspaceCommit,
        onRenameNameChange: handleRenameWorkspaceNameChange,
        onRenameStart: handleRenameWorkspaceStart,
        onSelect: handleWorkspaceSelect,
    };

    return (
        <>
            <WorkspaceBarContextProvider value={workspaceBarContextValue}>
                <nav className={styles.workspaceBar} aria-label={t(locale, 'workspaceBarAriaLabel')}>
                    {workspaces.map((workspace, index) => {
                        const previousWorkspaceId = index > 0 ? workspaces[index - 1]?.id ?? null : null;

                        return (
                            <WorkspaceItem
                                key={workspace.id}
                                previousWorkspaceId={previousWorkspaceId}
                                workspace={workspace}
                            />
                        );
                    })}

                    {isAdding ? (
                        <AddWorkspaceForm
                            error={workspaceError}
                            locale={locale}
                            name={name}
                            onCancel={handleAddWorkspaceCancel}
                            onNameChange={handleAddWorkspaceNameChange}
                            onSubmit={handleAddWorkspaceSubmit}
                        />
                    ) : (
                        <>
                            {workspaces.length > 0 ? (
                                <span className={trailingSeparatorClassName} aria-hidden>
                                    |
                                </span>
                            ) : null}

                            <button
                                type="button"
                                className={styles.addButton}
                                onClick={handleStartAddingWorkspace}
                                aria-label={t(locale, 'addWorkspaceAriaLabel')}
                            >
                                +
                            </button>
                        </>
                    )}
                </nav>
            </WorkspaceBarContextProvider>

            <Modal
                open={pendingDeleteWorkspace !== null}
                title={t(locale, 'workspaceDeleteConfirmTitle')}
                onClose={handleDeleteWorkspaceCancel}
                closeLabel={t(locale, 'cancel')}
                confirmLabel={t(locale, 'remove')}
                onConfirm={handleDeleteWorkspaceModalConfirm}
            >
                <p className={styles.modalText}>
                    {t(locale, 'workspaceDeleteConfirmMessage')}
                    {' '}
                    <strong className={styles.modalWorkspaceName}>{pendingDeleteWorkspace?.name}</strong>
                </p>

                <p className={styles.modalWarning}>{t(locale, 'workspaceDeleteConfirmWarning')}</p>
            </Modal>
        </>
    );
}
