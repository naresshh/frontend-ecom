import React, { useEffect } from 'react';
import { useError } from './ErrorContext.jsx';

const GlobalErrorDisplay = () => {
    const { errorMessage, clearError } = useError();

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                clearError();  // Clear error after 5 seconds
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [errorMessage, clearError]);

    if (!errorMessage) return null;

    return (
        <div style={{ backgroundColor: 'red', color: 'white', padding: '10px', position: 'fixed', top: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
            <strong>Error: </strong>{errorMessage}
        </div>
    );
};

export default GlobalErrorDisplay;
