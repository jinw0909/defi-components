import React, { useCallback, useContext, useState, useEffect } from 'react';
import { PhantomConnect, OkxConnect, MetamaskConnect } from '../../components';
import {WalletContext } from '../../context/WalletContext';
import {useSelector, useDispatch} from "react-redux";
import {clearWallet, updateWallet} from "../../context/walletSlice";

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
const ComponentB = () => {
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
            <PhantomConnect/>
            <OkxConnect/>
            <MetamaskConnect/>
        </div>
    );
};

const WalletConnection = () => {
    // Get wallet state from Redux store
    // const wallet = useSelector((state) => state.wallet);
    // const dispatch = useDispatch();
    const { wallet } = useContext(WalletContext);

    // const { wallet, updateWallet, clearWallet } = useContext(WalletContext);
    const [showWalletOptions, setShowWalletOptions] = useState(false);
    const [showLogoutButton, setShowLogoutButton] = useState(false);


    const handleLogout = async () => {
        if (wallet && wallet.disconnect) {
            await wallet.disconnect();
        }
        // dispatch(clearWallet());
        setShowLogoutButton(false);
    };

    const handlePanelClick = () => {
        if (!wallet) {
            setShowWalletOptions(true);
        } else {
            setShowLogoutButton((prev) => !prev);
        }
    };

    // This effect "listens" to changes in the wallet state.
    useEffect(() => {
        if (wallet) {
            console.log('Wallet updated in context:', wallet);
            // You can execute additional logic here whenever the wallet changes.
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
            { !wallet && showWalletOptions && (
                <ComponentB />
            )}
        </div>
    );
};

export default WalletConnection;
