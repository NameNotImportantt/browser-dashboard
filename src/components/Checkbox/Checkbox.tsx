import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {Check} from 'lucide-react';
import styles from './Checkbox.module.scss';

export interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: ReactNode;
  className?: string;
  id?: string;
}

export function Checkbox({checked, onChange, label, className, id}: CheckboxProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const rootClassName = clsx(styles.checkbox, className);

    return (
        <label className={rootClassName} htmlFor={inputId}>
            <input
                id={inputId}
                type="checkbox"
                className={styles.input}
                checked={checked}
                onChange={() => onChange()}
            />
            <span className={styles.box} aria-hidden>
                <Check className={styles.checkIcon} size={14} strokeWidth={2.75} />
            </span>
            {label ? <span className={styles.label}>{label}</span> : null}
        </label>
    );
}
