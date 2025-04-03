import React, { createContext, useContext, useState } from 'react';

// Create the Error Context
const ErrorContext = createContext();

// Error Provider Component
export const ErrorProvider = ({ children }) => {
    const [errorMessage, setErrorMessage] = useState("");

    // Function to set the error message
    const setError = (message) => {
        setErrorMessage(message);
    };

    // Function to clear the error message
    const clearError = () => {
        setErrorMessage("");
    };

    return (
        <ErrorContext.Provider value={{ errorMessage, setError, clearError }}>
            {children}
        </ErrorContext.Provider>
    );
};

// Custom hook to use the Error Context
export const useError = () => {
    return useContext(ErrorContext);
};
