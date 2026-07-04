import type {ReactNode} from 'react';

interface FieldMessageProps {
    ariaLive?: 'polite' | 'assertive';
    children: ReactNode;
    className: string;
    id: string;
}

export function FieldMessage({ariaLive, children, className, id}: FieldMessageProps) {
    if (!children) {
        return null;
    }

    return (
        <small className={className} id={id} aria-live={ariaLive}>
            {children}
        </small>
    );
}
