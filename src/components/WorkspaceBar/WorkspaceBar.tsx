import {useState, type FormEvent} from 'react';
import {t} from '@/app';
import {useSettings, useWorkspaces} from '@/dashboard';
import styles from './WorkspaceBar.module.scss';

export function WorkspaceBar() {
    const {workspaces, activeWorkspaceId, selectWorkspace, addWorkspace, deleteWorkspace} = useWorkspaces();
    const {locale} = useSettings();
    const [isAdding, setIsAdding] = useState(false);
    const [name, setName] = useState('');
    const [hoveredWorkspaceId, setHoveredWorkspaceId] = useState<string | null>(null);

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

                return (
                    <span
                        className={`${styles.workspaceItem} ${hoveredWorkspaceId === workspace.id ? styles.isHovered : ''}`}
                        key={workspace.id}
                        onMouseEnter={() => setHoveredWorkspaceId(workspace.id)}
                        onMouseLeave={() => setHoveredWorkspaceId(null)}
                    >
                        {index > 0 ? <span className={styles.separator} aria-hidden>|</span> : null}
                        <span className={styles.workspaceControl}>
                            <button
                                type="button"
                                className={`${styles.workspaceButton} ${isActive ? styles.isActive : ''}`}
                                aria-current={isActive ? 'true' : undefined}
                                onClick={() => void selectWorkspace(workspace.id)}
                            >
                                {workspace.name.toUpperCase()}
                            </button>
                            {workspaces.length > 1 ? (
                                <button
                                    type="button"
                                    className={`${styles.removeButton} ${hoveredWorkspaceId === workspace.id ? styles.isVisible : ''}`}
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
                        value={name}
                        onChange={event => setName(event.target.value)}
                        placeholder={t(locale, 'bookmarkTitle')}
                        aria-label={t(locale, 'workspaceNameAriaLabel')}
                        autoFocus
                        required
                    />
                    <button className="primary" type="submit">
                        +
                    </button>
                    <button type="button" onClick={() => setIsAdding(false)}>
                        ×
                    </button>
                </form>
            ) : (
                <>
                    {workspaces.length > 0 ? <span className={styles.separator} aria-hidden>|</span> : null}
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
