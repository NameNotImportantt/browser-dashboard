import {useCallback, useState} from 'react';

export type ActionStatusState = 'idle' | 'pending' | 'success' | 'error';

export function useActionStatus() {
    const [status, setStatus] = useState<ActionStatusState>('idle');
    const [message, setMessage] = useState<string | null>(null);

    const reset = useCallback(() => {
        setStatus('idle');
        setMessage(null);
    }, []);

    const start = useCallback(() => {
        setStatus('pending');
        setMessage(null);
    }, []);

    const succeed = useCallback((nextMessage: string | null = null) => {
        setStatus('success');
        setMessage(nextMessage);
    }, []);

    const fail = useCallback((nextMessage: string) => {
        setStatus('error');
        setMessage(nextMessage);
    }, []);

    return {
        status,
        message,
        isPending: status === 'pending',
        reset,
        start,
        succeed,
        fail,
    };
}
