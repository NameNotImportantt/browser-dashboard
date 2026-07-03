import type {ChangeEvent, FocusEvent, MouseEvent} from 'react';
import clsx from 'clsx';
import {normalizeHexColor} from '@/theme';
import styles from './TextColorField.module.scss';

interface TextColorFieldProps {
  label: string;
  value: string;
  pickerValue: string;
  placeholder: string;
  swatches: string[];
  onChange: (value: string, commit?: boolean) => void;
}

export function TextColorField({label, value, pickerValue, placeholder, swatches, onChange}: TextColorFieldProps) {
    const selectedValue = normalizeHexColor(value) ?? pickerValue;
    const inputColorValue = normalizeHexColor(pickerValue) ?? placeholder;

    const handleHexInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    const handleHexInputBlur = (event: FocusEvent<HTMLInputElement>) => {
        onChange(event.target.value, true);
    };

    const handlePickerChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value, true);
    };

    const handleSwatchClick = (event: MouseEvent<HTMLButtonElement>) => {
        onChange(event.currentTarget.value, true);
    };

    return (
        <label className={styles.field}>
            <span className={styles.fieldLabel}>{label}</span>

            <div className={styles.controlRow}>
                <input
                    className={styles.colorInput}
                    type="color"
                    value={inputColorValue}
                    onChange={handlePickerChange}
                    aria-label={label}
                />

                <input
                    className={styles.hexInput}
                    value={value}
                    onChange={handleHexInputChange}
                    onBlur={handleHexInputBlur}
                    spellCheck={false}
                    maxLength={7}
                    placeholder={placeholder}
                />

                <div className={styles.swatchRow} role="list" aria-label={label}>
                    {swatches.map((color, index) => {
                        const isSelected = selectedValue === color;
                        const swatchClassName = clsx(styles.swatch, {[styles.swatchSelected]: isSelected});

                        return (
                            <button
                                key={`${color}-${index}`}
                                type="button"
                                value={color}
                                className={swatchClassName}
                                style={{backgroundColor: color}}
                                onClick={handleSwatchClick}
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
