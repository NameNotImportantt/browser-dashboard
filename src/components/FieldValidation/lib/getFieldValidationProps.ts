export interface FieldValidationState {
    error: string | null;
    touched: boolean;
    submitted: boolean;
}

export interface FieldValidationAriaProps {
    'aria-describedby'?: string;
    'aria-invalid'?: 'true';
}

interface GetFieldValidationPropsOptions {
    describedBy?: string;
    messageId: string;
    validation: FieldValidationState;
}

interface FieldValidationPropsResult extends FieldValidationAriaProps {
    isInvalid: boolean;
    messageId: string;
    showError: boolean;
}

export function getFieldValidationProps({
    describedBy,
    messageId,
    validation,
}: GetFieldValidationPropsOptions): FieldValidationPropsResult {
    const showError = validation.error !== null && (validation.touched || validation.submitted);
    const invalidMessageId = showError ? messageId : undefined;
    const ariaDescribedBy = mergeAriaDescribedBy(describedBy, invalidMessageId);

    return {
        'aria-describedby': ariaDescribedBy,
        'aria-invalid': showError ? 'true' : undefined,
        isInvalid: showError,
        messageId,
        showError,
    };
}

function mergeAriaDescribedBy(currentDescribedBy?: string, messageId?: string) {
    if (currentDescribedBy && messageId) {
        return `${currentDescribedBy} ${messageId}`;
    }

    return currentDescribedBy ?? messageId;
}
