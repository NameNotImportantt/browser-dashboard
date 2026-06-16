import { Check } from "lucide-react";
import { useId } from "react";
import type { CheckboxProps } from "./types/CheckboxProps";
import styles from "./Checkbox.module.scss";

export function Checkbox({ checked, onChange, label, className, id }: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const rootClassName = [styles.checkbox, className].filter(Boolean).join(" ");

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
