import {normalizeHexColor} from '@/app';
import styles from './TextColorField.module.scss';

export interface TextColorFieldProps {
  label: string;
  value: string;
  placeholder: string;
  swatches: string[];
  onChange: (value: string, commit?: boolean) => void;
}

export function TextColorField({label, value, placeholder, swatches, onChange}: TextColorFieldProps) {
    const normalizedValue = normalizeHexColor(value);

    return (
        <label className={styles.field}>
            <span>{label}</span>
            <div className={styles.controlRow}>
                <input
                    className={styles.hexInput}
                    value={value}
                    onChange={event => onChange(event.target.value)}
                    onBlur={event => onChange(event.target.value, true)}
                    spellCheck={false}
                    maxLength={7}
                    placeholder={placeholder}
                />
                <div className={styles.swatchRow} role="list" aria-label={label}>
                    {swatches.map((color, index) => {
                        const isSelected = normalizedValue === color;

                        return (
                            <button
                                key={`${color}-${index}`}
                                type="button"
                                className={`${styles.swatch} ${isSelected ? styles.swatchSelected : ''}`}
                                style={{backgroundColor: color}}
                                onClick={() => onChange(color, true)}
                                aria-label={color}
                                aria-pressed={isSelected}
                                title={color}
                            />
                        );
                    })}
                </div>
            </div>
        </label>
    );
}
