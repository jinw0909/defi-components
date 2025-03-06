import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import {clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { getPhantomProvider } from "../../utils";
import ConnectButton from "../ConnectButton";

const CUSTOM_RPC_URL = 'https://winter-evocative-silence.solana-mainnet.quiknode.pro/04a5e639b0bd9ceeec758a6140dc1aa1b08f62bd';
const connection = new Connection(CUSTOM_RPC_URL);
const provider = getPhantomProvider();

const useProps = () => {

    const [publicKey, setPublicKey] = useState(null);

    useEffect(() => {
        if (!provider) return;

        provider.on('connect', (publicKey) => {
            console.log('phantom connected: ', publicKey.toBase58());
            setPublicKey(publicKey.toBase58());
        });

        provider.on('disconnect', () => {
            console.log('phantom disconnected');
            setPublicKey(null);
        });

        provider.on('accountChanged', (publicKey) => {
            if (publicKey) {
                console.log('Switched to Phantom account: ', publicKey.toBase58());
                setPublicKey(publicKey);
            } else {
                /**
                 * In this case dApps could...
                 *
                 * 1. Not do anything
                 * 2. Only re-connect to the new account if it is trusted
                 *
                 * ```
                 * provider.connect({ onlyIfTrusted: true }).catch((err) => {
                 *  // fail silently
                 * });
                 * ```
                 *
                 * 3. Always attempt to reconnect
                 */
                provider.connect().catch((error) => {
                    console.error(`Failed to re-connect: , ${error.message}`);
                });
            }
        });

        return () => {
            provider.disconnect();
        }

    }, []);

    /*** Connect */
    const handleConnect = useCallback(async () => {
        if (!provider) return;

        try {
            await provider.connect();
        } catch (error) {
            console.error(error.message);
        }
    }, []);

    /*** DisConnect */
    const handleDisconnect = useCallback(async () => {
        if (!provider) return;

        try {
            await provider.disconnect();
        } catch (error) {
           console.error(error.message);
        }
    }, []);

    const connectedMethods = useMemo(() => {
        return [
            {
                name : 'Disconnect',
                onClick: handleDisconnect
            }
        ]
    }, [
        handleDisconnect
    ]);

    return {
        publicKey: provider?.publicKey || null,
        connectedMethods,
        handleConnect,
        handleDisconnect
    }

}

const StatelessComponent = React.memo((props) => {

    const { publicKey, handleConnect, handleDisconnect, connectedMethods } = props;

    return (
        <ConnectButton publicKey={publicKey} connectedMethods={connectedMethods} connect={handleConnect} disconnect={handleDisconnect}/>
    );
});

const PhantomConnect = () => {
    const props = useProps();
    return <StatelessComponent {...props}/>
}

export default PhantomConnect;