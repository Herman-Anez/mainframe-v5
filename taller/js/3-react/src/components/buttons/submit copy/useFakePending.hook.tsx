// useFormPending.js
import { useState, useCallback } from 'react';

export const useFakePending = () => {

    const [data, setData] = useState(null);

    const handleSubmit = useCallback((event, action) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        setData(formData);

        startTransition(async () => {
            if (action && typeof action === 'function') {
                await action(formData);
            }
            // Si quieres resetear data después de enviar:
            // setData(null);
        });
    }, []);

    return { pending: isPending, data, handleSubmit };
};