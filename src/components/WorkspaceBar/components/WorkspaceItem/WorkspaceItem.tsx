import {useRef, type ChangeEvent, type KeyboardEvent} from 'react';
import clsx from 'clsx';
import {Pencil} from 'lucide-react';
import {FieldValidationMessage, fieldValidationStyles} from '@/components';
import {t} from '@/i18n';
import {useWorkspaceBarContext} from '../../WorkspaceBarContext';
import styles from './WorkspaceItem.module.scss';
import type {Workspace} from '@/db';

interface WorkspaceItemProps {
    previousWorkspaceId: string | null;
    workspace: Workspace;
}

export function WorkspaceItem({previousWorkspaceId, workspace}: WorkspaceItemProps) {
    const {
        activeWorkspaceId,
        canDeleteWorkspaces,
        editingWorkspaceId,
        hoveredWorkspaceId,
        isRenameInvalid,
        locale,
        renameErrorMessage,
        renameInputAriaProps,
        renameMessageId,
        renameName,
        onDeleteRequest,
        onHoverChange,
        onRenameCancel,
        onRenameCommit,
        onRenameNameChange,
        onRenameStart,
        onSelect,
    } = useWorkspaceBarContext();

    const renameBlurCancelledRef = useRef(false);
    const isActive = workspace.id === activeWorkspaceId;
    const isEditing = workspace.id === editingWorkspaceId;
    const isHovered = hoveredWorkspaceId === workspace.id;
    const showSeparator = previousWorkspaceId !== null;
    const separatorHidden = showSeparator && (isHovered || hoveredWorkspaceId === previousWorkspaceId);
    const workspaceItemClassName = clsx(styles.workspaceItem, {[styles.isHovered]: isHovered});
    const separatorClassName = clsx(styles.separator, {[styles.separatorHidden]: separatorHidden});
    const workspaceButtonClassName = clsx(styles.workspaceButton, {[styles.isActive]: isActive});
    const workspaceActionsClassName = clsx(styles.workspaceActions, {[styles.isVisible]: isHovered});

    const workspaceInputClassName = clsx(
        styles.workspaceInput,
        isRenameInvalid && fieldValidationStyles.fieldControlInvalid,
    );

    const handleMouseEnter = () => {
        onHoverChange(workspace.id);
    };

    const handleMouseLeave = () => {
        onHoverChange(null);
    };

    const handleSelectClick = async () => {
        await onSelect(workspace.id);
    };

    const handleSelectButtonClick = () => {
        void handleSelectClick();
    };

    const handleRenameStartClick = () => {
        onRenameStart(workspace);
    };

    const handleDeleteClick = () => {
        onDeleteRequest(workspace.id);
    };

    const handleRenameInputChange = (value: string) => {
        onRenameNameChange(value);
    };

    const handleRenameInputChangeEvent = (event: ChangeEvent<HTMLInputElement>) => {
        handleRenameInputChange(event.target.value);
    };

    const handleRenameBlur = async () => {
        if (renameBlurCancelledRef.current) {
            renameBlurCancelledRef.current = false;
            return;
        }

        await onRenameCommit(workspace);
    };

    const handleRenameKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            await onRenameCommit(workspace);
            return;
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            renameBlurCancelledRef.current = true;
            onRenameCancel();
            event.currentTarget.blur();
        }
    };

    const handleRenameBlurEvent = () => {
        void handleRenameBlur();
    };

    const handleRenameKeyDownEvent = (event: KeyboardEvent<HTMLInputElement>) => {
        void handleRenameKeyDown(event);
    };

    return (
        <span
            className={workspaceItemClassName}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {showSeparator ? (
                <span className={separatorClassName} aria-hidden>
                    |
                </span>
            ) : null}

            <span className={styles.workspaceControl}>
                {isEditing ? (
                    <input
                        className={workspaceInputClassName}
                        value={renameName}
                        onChange={handleRenameInputChangeEvent}
                        onBlur={handleRenameBlurEvent}
                        onKeyDown={handleRenameKeyDownEvent}
                        aria-label={t(locale, 'workspaceNameAriaLabel')}
                        {...renameInputAriaProps}
                        autoFocus
                    />
                ) : (
                    <button
                        type="button"
                        className={workspaceButtonClassName}
                        aria-current={isActive ? 'true' : undefined}
                        onClick={handleSelectButtonClick}
                    >
                        {workspace.name.toUpperCase()}
                    </button>
                )}

                {!isEditing ? (
                    <span className={workspaceActionsClassName}>
                        <button
                            type="button"
                            className={styles.workspaceActionButton}
                            aria-label={`${t(locale, 'renameWorkspaceAriaLabel')} ${workspace.name}`}
                            onClick={handleRenameStartClick}
                        >
                            <Pencil size={10} strokeWidth={2.3} />
                        </button>

                        {canDeleteWorkspaces ? (
                            <button
                                type="button"
                                className={clsx(styles.workspaceActionButton, styles.removeButton)}
                                onClick={handleDeleteClick}
                                aria-label={`${t(locale, 'remove')} ${workspace.name}`}
                            >
                                ×
                            </button>
                        ) : null}
                    </span>
                ) : null}
            </span>

            {isEditing ? (
                <FieldValidationMessage
                    className={styles.workspaceInlineError}
                    id={renameMessageId}
                    message={renameErrorMessage}
                />
            ) : null}
        </span>
    );
}
