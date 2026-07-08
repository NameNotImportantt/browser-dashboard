import clsx from 'clsx';
import styles from './IconButton.module.scss';
import type {ButtonHTMLAttributes, ReactNode} from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    withChrome?: boolean;
}

export function IconButton({
    children,
    className,
    type = 'button',
    withChrome = true,
    ...props
}: IconButtonProps) {
    const iconButtonClassName = clsx(
        styles.iconButton,
        !withChrome && styles.withoutChrome,
        className,
    );

    return (
        <button
            type={type}
            className={iconButtonClassName}
            {...props}
        >
            {children}
        </button>
    );
}
