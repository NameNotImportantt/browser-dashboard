import clsx from 'clsx';
import {Modal} from '@/components/Modal';
import {t} from '@/i18n';
import {AddWorkspaceForm} from './components/AddWorkspaceForm/AddWorkspaceForm';
import {WorkspaceItem} from './components/WorkspaceItem/WorkspaceItem';
import {useWorkspaceBarController} from './hooks/useWorkspaceBarController';
import styles from './WorkspaceBar.module.scss';
import {WorkspaceBarContextProvider} from './WorkspaceBarContext';

interface WorkspaceBarProps {
    dismissRequestId?: number;
}

export function WorkspaceBar({dismissRequestId = 0}: WorkspaceBarProps) {
    const {
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
        onRenameCancel,
        pendingDeleteWorkspace,
        renameName,
        renameWorkspaceValidation,
        workspaces,
    } = useWorkspaceBarController({dismissRequestId});

    const trailingSeparatorClassName = clsx(styles.separator, {
        [styles.separatorHidden]: hoveredWorkspaceId === workspaces[workspaces.length - 1]?.id,
    });

    const handleDeleteWorkspaceModalConfirm = () => {
        void handleDeleteWorkspaceConfirm();
    };

    const workspaceBarContextValue = {
        activeWorkspaceId,
        canDeleteWorkspaces,
        editingWorkspaceId,
        hoveredWorkspaceId,
        isRenameInvalid: renameWorkspaceValidation.isInvalid,
        locale,
        renameErrorMessage: renameWorkspaceValidation.showError ? renameWorkspaceValidation.validation.error : null,
        renameInputAriaProps: renameWorkspaceValidation.getAriaProps(),
        renameMessageId: renameWorkspaceValidation.messageId,
        renameName,
        onDeleteRequest: handleDeleteWorkspaceRequest,
        onHoverChange: handleWorkspaceHover,
        onRenameCancel,
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
                            errorMessage={addWorkspaceValidation.showError ? addWorkspaceValidation.validation.error : null}
                            inputAriaProps={addWorkspaceValidation.getAriaProps()}
                            isInvalid={addWorkspaceValidation.isInvalid}
                            locale={locale}
                            messageId={addWorkspaceValidation.messageId}
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
