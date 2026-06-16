import type { TextColorFieldProps } from "./types/TextColorFieldProps";
import styles from "./TextColorField.module.scss";

export function TextColorField({ label, value, swatches, onChange }: TextColorFieldProps) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input
        className={styles.hexInput}
        value={value}
        onChange={event => onChange(event.target.value)}
        onBlur={event => onChange(event.target.value, true)}
        spellCheck={false}
        maxLength={7}
        placeholder="#e7ecff"
      />
      <div className={styles.swatchRow} role="list" aria-label={label}>
        {swatches.map((color, index) => (
          <button
            key={`${color}-${index}`}
            type="button"
            className={styles.swatch}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color, true)}
            aria-label={color}
            title={color}
          />
        ))}
      </div>
    </label>
  );
}
