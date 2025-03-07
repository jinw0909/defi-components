import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PublicKey, Connection } from '@solana/web3.js';
import { getPhantomProvider } from '../../utils';
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useDispatch } from "react-redux";
import { updateWallet, clearWallet } from "../../context/walletSlice";

const CUSTOM_RPC_URL = 'https://winter-evocative-silence.solana-mainnet.quiknode.pro/04a5e639b0bd9ceeec758a6140dc1aa1b08f62bd';
const connection = new Connection(CUSTOM_RPC_URL);
const provider = getPhantomProvider();

const usePhantomProps = (onConnected) => {
    const dispatch = useDispatch();
    const [publicKey, setPublicKey] = useState(null);

    // Disconnect function to be passed to parent via onConnected callback
    const handleDisconnect = useCallback(async () => {
        console.log("calling phantom handleDisconnect()");
        if (!provider) return;
        try {
            await provider.disconnect();
            dispatch(clearWallet());
        } catch (error) {
            console.error(error.message);
        }
    }, [dispatch]);

    // Connect function to trigger wallet connection
    const handleConnect = useCallback(async () => {
        if (!provider) return;
        try {
            await provider.connect();
        } catch (error) {
            console.error(error.message);
        }
    }, []);

    // Fetch SOL balance for the connected wallet
    const handleFetchSolana = useCallback(async () => {
        if (!provider) return;
        try {
            let walletPublicKey = new PublicKey(provider.publicKey.toBase58());
            console.log("walletPublicKey: ", walletPublicKey);
            const balanceLamports = await connection.getBalance(walletPublicKey);
            const balanceSOL = balanceLamports / 1e9;
            console.log("balanceSOL: ", balanceSOL);
            return balanceSOL;
        } catch (error) {
            console.error(error.message);
        }
    }, []);

    const connectedMethods = useMemo(() => [
        { name: 'Disconnect', onClick: handleDisconnect }
    ], [handleDisconnect]);

    useEffect(() => {
        if (!provider) return;

        provider.on('connect', async (pk) => {
            const keyStr = pk.toBase58();
            console.log('Phantom connected:', keyStr);
            setPublicKey(keyStr);
            let solAmount = await handleFetchSolana();
            // Update Redux state without including the disconnect function.
            dispatch(updateWallet({
                walletName: 'phantom',
                publicKey: keyStr,
                tokenBalance: solAmount
            }));
            // Pass the disconnect function to the parent via the onConnected callback.
            if (onConnected && typeof onConnected === 'function') {
                onConnected(handleDisconnect);
            }
        });

        provider.on('disconnect', () => {
            console.log('Phantom disconnected');
            setPublicKey(null);
            dispatch(clearWallet());
        });

        provider.on('accountChanged', (pk) => {
            if (pk) {
                console.log('Switched to Phantom account:', pk.toBase58());
                setPublicKey(pk.toBase58());
            } else {
                // Attempt to reconnect if needed.
                provider.connect().catch((error) => {
                    console.error(`Failed to re-connect: ${error.message}`);
                });
            }
        });

        return () => {
            provider.removeAllListeners('connect');
            provider.removeAllListeners('disconnect');
            provider.removeAllListeners('accountChanged');
        };
    }, [dispatch, handleDisconnect, handleFetchSolana, onConnected]);

    return {
        publicKey,
        connectedMethods,
        handleConnect,
        handleDisconnect,
    };
};

const PhantomConnect = ({ onConnected }) => {
    const phantomProps = usePhantomProps(onConnected);

    return (
        !provider ? (
            <button disabled style={{ opacity: 0.5 }}>
                Phantom Wallet Uninstalled
            </button>
        ) : (
            <button onClick={phantomProps.handleConnect}>
                Connect to Phantom
            </button>
        )
    );
};

export default React.memo(PhantomConnect);
