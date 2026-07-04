interface GetFieldMessagePropsOptions {
    error: string | null;
    hasHint?: boolean;
    id: string;
}

export function getFieldMessageProps({error, hasHint = false, id}: GetFieldMessagePropsOptions) {
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;
    const describedBy = error ? errorId : hasHint ? hintId : undefined;

    return {
        errorId,
        hintId,
        inputProps: {
            'aria-describedby': describedBy,
            'aria-invalid': error ? ('true' as const) : undefined,
        },
    };
}
