import { useState, useCallback, useRef, useEffect } from 'react';

// Custom hook: simula un pending de N ms (default 3s) sin lógica real de negocio
export const useFakePending = (delay = 3000) => {

    const [pending, setPending] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const trigger = useCallback(() => {
        if (pending) return;
        setPending(true);
        timeoutRef.current = setTimeout(() => {
            setPending(false);
        }, delay);
    }, [pending, delay]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return { pending, trigger };
};
