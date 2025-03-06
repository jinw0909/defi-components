// WalletContext.js
import React, { createContext, useState, useCallback, useMemo } from 'react';

export const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
    const [wallet, setWallet] = useState(null);

    const updateWallet = useCallback((newWallet) => {
        setWallet(newWallet);
    }, []);

    const clearWallet = useCallback(() => {
        setWallet(null);
    }, []);

    const contextValue = useMemo(() => ({
        wallet,
        updateWallet,
        clearWallet
    }), [wallet, updateWallet, clearWallet]);

    return (
        <WalletContext.Provider value={ contextValue }>
            {children}
        </WalletContext.Provider>
    );
};
