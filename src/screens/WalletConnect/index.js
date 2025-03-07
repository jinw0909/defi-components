import React, { useState, useEffect } from 'react';
import { PhantomConnect, OkxConnect, MetamaskConnect } from '../../components';
import { useSelector, useDispatch } from "react-redux";
import { clearWallet } from "../../context/walletSlice";

const ComponentA = ({ connectedWallet, onClick, onLogout, showLogoutButton }) => {
    return (
        <div
            onClick={onClick}
            style={{
                border: '1px solid black',
                padding: '10px',
                cursor: 'pointer',
                maxWidth: '300px',
                margin: '0 auto',
            }}
        >
            {connectedWallet ? (
                <>
                    <div>{`${connectedWallet.walletName} Connected`}</div>
                    <div>{`Public Key: ${connectedWallet.publicKey}`}</div>
                    {showLogoutButton && (
                        <button onClick={(e) => { e.stopPropagation(); onLogout(); }}>
                            Logout
                        </button>
                    )}
                </>
            ) : (
                <div>Connect Wallet</div>
            )}
        </div>
    );
};

const ComponentB = ({ onWalletConnected }) => {
    return (
        <div
            style={{
                border: '1px solid gray',
                padding: '10px',
                marginTop: '10px',
                maxWidth: '300px',
                margin: '10px auto',
            }}
        >
            <h4>Select a wallet to connect:</h4>
            {/* Pass the onWalletConnected callback to PhantomConnect */}
            <PhantomConnect onConnected={onWalletConnected} />
            <OkxConnect />
            <MetamaskConnect />
        </div>
    );
};

const WalletConnection = () => {
    // Get wallet state from Redux store.
    const wallet = useSelector((state) => state.wallet);
    const dispatch = useDispatch();

    const [showWalletOptions, setShowWalletOptions] = useState(false);
    const [showLogoutButton, setShowLogoutButton] = useState(false);
    // Local state to store the disconnect function received from PhantomConnect.
    const [disconnectFn, setDisconnectFn] = useState(null);

    // Callback to be passed to the wallet connect component(s).
    const handleWalletConnected = (disconnectFunction) => {
        setDisconnectFn(() => disconnectFunction);
    };

    const handleLogout = async () => {
        if (disconnectFn) {
            await disconnectFn();
        }
        dispatch(clearWallet());
        setDisconnectFn(null);
        setShowLogoutButton(false);
    };

    const handlePanelClick = () => {
        if (!wallet) {
            setShowWalletOptions(true);
        } else {
            setShowLogoutButton(prev => !prev);
        }
    };

    useEffect(() => {
        if (wallet) {
            console.log('Wallet updated in Redux store:', wallet);
        } else {
            console.log('No wallet connected.');
        }
    }, [wallet]);

    return (
        <div>
            <ComponentA
                connectedWallet={wallet}
                onClick={handlePanelClick}
                onLogout={handleLogout}
                showLogoutButton={showLogoutButton}
            />
            {(!wallet && showWalletOptions) && (
                <ComponentB onWalletConnected={handleWalletConnected} />
            )}
        </div>
    );
};

export default WalletConnection;
