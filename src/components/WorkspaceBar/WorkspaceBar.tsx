import {useState, type FormEvent} from 'react';
import clsx from 'clsx';
import {t} from '@/app';
import {useSettings, useWorkspaces} from '@/dashboard';
import styles from './WorkspaceBar.module.scss';

export function WorkspaceBar() {
    const {workspaces, activeWorkspaceId, selectWorkspace, addWorkspace, deleteWorkspace} = useWorkspaces();
    const {locale} = useSettings();
    const [isAdding, setIsAdding] = useState(false);
    const [name, setName] = useState('');
    const [hoveredWorkspaceId, setHoveredWorkspaceId] = useState<string | null>(null);
    const addFormSubmitButtonClassName = clsx(styles.addFormButton, 'primary');

    const trailingSeparatorClassName = clsx(styles.separator, {
        [styles.separatorHidden]: hoveredWorkspaceId === workspaces[workspaces.length - 1]?.id,
    });

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const value = name.trim();

        if (!value) {return;}

        await addWorkspace(value);
        setName('');
        setIsAdding(false);
    };

    return (
        <nav className={styles.workspaceBar} aria-label={t(locale, 'workspaceBarAriaLabel')}>
            {workspaces.map((workspace, index) => {
                const isActive = workspace.id === activeWorkspaceId;
                const isHovered = hoveredWorkspaceId === workspace.id;
                const shouldHideSeparator = index > 0 && (isHovered || hoveredWorkspaceId === workspaces[index - 1]?.id);
                const workspaceItemClassName = clsx(styles.workspaceItem, {[styles.isHovered]: isHovered});
                const separatorClassName = clsx(styles.separator, {[styles.separatorHidden]: shouldHideSeparator});
                const workspaceButtonClassName = clsx(styles.workspaceButton, {[styles.isActive]: isActive});
                const removeButtonClassName = clsx(styles.removeButton, {[styles.isVisible]: isHovered});

                return (
                    <span
                        className={workspaceItemClassName}
                        key={workspace.id}
                        onMouseEnter={() => setHoveredWorkspaceId(workspace.id)}
                        onMouseLeave={() => setHoveredWorkspaceId(null)}
                    >
                        {index > 0 ? (
                            <span className={separatorClassName} aria-hidden>
                                |
                            </span>
                        ) : null}
                        <span className={styles.workspaceControl}>
                            <button
                                type="button"
                                className={workspaceButtonClassName}
                                aria-current={isActive ? 'true' : undefined}
                                onClick={() => void selectWorkspace(workspace.id)}
                            >
                                {workspace.name.toUpperCase()}
                            </button>
                            {workspaces.length > 1 ? (
                                <button
                                    type="button"
                                    className={removeButtonClassName}
                                    onClick={() => void deleteWorkspace(workspace.id)}
                                    aria-label={`${t(locale, 'remove')} ${workspace.name}`}
                                >
                                    ×
                                </button>
                            ) : null}
                        </span>
                    </span>
                );
            })}

            {isAdding ? (
                <form className={styles.addForm} onSubmit={submit}>
                    <input
                        className={styles.addInput}
                        value={name}
                        onChange={event => setName(event.target.value)}
                        placeholder={t(locale, 'bookmarkTitle')}
                        aria-label={t(locale, 'workspaceNameAriaLabel')}
                        autoFocus
                        required
                    />
                    <button className={addFormSubmitButtonClassName} type="submit">
                        +
                    </button>
                    <button className={styles.addFormButton} type="button" onClick={() => setIsAdding(false)}>
                        ×
                    </button>
                </form>
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
                        onClick={() => setIsAdding(true)}
                        aria-label={t(locale, 'addWorkspaceAriaLabel')}
                    >
                        +
                    </button>
                </>
            )}
        </nav>
    );
}
