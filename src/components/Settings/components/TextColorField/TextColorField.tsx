import {useEffect, type ChangeEvent, type FocusEvent, type MouseEvent} from 'react';
import clsx from 'clsx';
import {FieldValidationMessage, fieldValidationStyles, useFieldValidation} from '@/components';
import {normalizeHexColor} from '@/theme';
import styles from './TextColorField.module.scss';

interface TextColorFieldProps {
  invalidMessage: string;
  label: string;
  value: string;
  pickerValue: string;
  placeholder: string;
  swatches: string[];
  onChange: (value: string, commit?: boolean) => void;
}

export function TextColorField({invalidMessage, label, value, pickerValue, placeholder, swatches, onChange}: TextColorFieldProps) {
    const selectedValue = normalizeHexColor(value) ?? pickerValue;
    const inputColorValue = normalizeHexColor(pickerValue) ?? placeholder;
    const validation = useFieldValidation();

    const fieldLabelClassName = clsx(
        styles.fieldLabel,
        validation.isInvalid && fieldValidationStyles.fieldLabelInvalid,
    );
    const hexInputClassName = clsx(
        styles.hexInput,
        validation.isInvalid && fieldValidationStyles.fieldControlInvalid,
    );

    useEffect(() => {
        if (normalizeHexColor(value) !== null) {
            validation.clearError();
        }
    }, [validation, value]);

    const handleHexInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const nextValue = event.target.value;

        onChange(nextValue);

        if (normalizeHexColor(nextValue) !== null) {
            validation.clearError();
        }
    };

    const handleHexInputBlur = (event: FocusEvent<HTMLInputElement>) => {
        validation.markTouched();

        if (normalizeHexColor(event.target.value) === null) {
            validation.setError(invalidMessage);
            return;
        }

        validation.clearError();
        onChange(event.target.value, true);
    };

    const handlePickerChange = (event: ChangeEvent<HTMLInputElement>) => {
        validation.clearError();
        onChange(event.target.value, true);
    };

    const handleSwatchClick = (event: MouseEvent<HTMLButtonElement>) => {
        validation.clearError();
        onChange(event.currentTarget.value, true);
    };

    return (
        <label className={styles.field}>
            <span className={fieldLabelClassName}>{label}</span>

            <div className={styles.controlRow}>
                <input
                    className={styles.colorInput}
                    type="color"
                    value={inputColorValue}
                    onChange={handlePickerChange}
                    aria-label={label}
                />

                <input
                    className={hexInputClassName}
                    value={value}
                    onChange={handleHexInputChange}
                    onBlur={handleHexInputBlur}
                    spellCheck={false}
                    maxLength={7}
                    placeholder={placeholder}
                    aria-label={label}
                    {...validation.getAriaProps()}
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

            <FieldValidationMessage
                className={styles.fieldMessage}
                id={validation.messageId}
                message={validation.showError ? validation.validation.error : null}
            />
        </label>
    );
}
