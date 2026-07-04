import {useCallback, useId, useRef, useState} from 'react';
import {getFieldValidationProps, type FieldValidationAriaProps, type FieldValidationState} from '../lib/getFieldValidationProps';

interface UseFieldValidationOptions {
    initialError?: string | null;
    initialSubmitted?: boolean;
    initialTouched?: boolean;
}

export function useFieldValidation({
    initialError = null,
    initialSubmitted = false,
    initialTouched = false,
}: UseFieldValidationOptions = {}) {
    const initialStateRef = useRef<FieldValidationState>({
        error: initialError,
        submitted: initialSubmitted,
        touched: initialTouched,
    });

    const generatedId = useId();
    const [validation, setValidation] = useState<FieldValidationState>(initialStateRef.current);
    const messageId = `${generatedId}-message`;
    const validationProps = getFieldValidationProps({messageId, validation});

    const setError = useCallback((error: string | null) => {
        setValidation(currentValidation => {
            if (currentValidation.error === error) {
                return currentValidation;
            }

            return {
                ...currentValidation,
                error,
            };
        });
    }, []);

    const clearError = useCallback(() => {
        setValidation(currentValidation => {
            if (currentValidation.error === null) {
                return currentValidation;
            }

            return {
                ...currentValidation,
                error: null,
            };
        });
    }, []);

    const markTouched = useCallback(() => {
        setValidation(currentValidation => {
            if (currentValidation.touched) {
                return currentValidation;
            }

            return {
                ...currentValidation,
                touched: true,
            };
        });
    }, []);

    const markSubmitted = useCallback(() => {
        setValidation(currentValidation => {
            if (currentValidation.submitted) {
                return currentValidation;
            }

            return {
                ...currentValidation,
                submitted: true,
            };
        });
    }, []);

    const reset = useCallback(() => {
        setValidation(initialStateRef.current);
    }, []);

    const getAriaProps = useCallback((describedBy?: string): FieldValidationAriaProps => {
        const ariaProps = getFieldValidationProps({
            describedBy,
            messageId,
            validation,
        });

        return {
            'aria-describedby': ariaProps['aria-describedby'],
            'aria-invalid': ariaProps['aria-invalid'],
        };
    }, [messageId, validation]);

    return {
        validation,
        showError: validationProps.showError,
        isInvalid: validationProps.isInvalid,
        messageId: validationProps.messageId,
        setError,
        clearError,
        markTouched,
        markSubmitted,
        reset,
        getAriaProps,
    };
}
