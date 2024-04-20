import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // Initialize user state from localStorage to keep user logged in between refreshes
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Effect to run once on mount and cleanup
    useEffect(() => {
        // Subscribe to changes in user state and update localStorage accordingly
        const handleStorageChange = () => {
            localStorage.setItem('user', JSON.stringify(user));
        };

        // Add when user changes
        window.addEventListener('storage', handleStorageChange);

        // Cleanup on component unmount
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            // Clear user from localStorage on logout or when user provider unmounts
            if (!user) {
                localStorage.removeItem('user');
            }
        };
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
