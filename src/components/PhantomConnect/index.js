import React, {useState, useEffect, useCallback, useMemo, useContext} from 'react';
import { PublicKey, Connection } from '@solana/web3.js';
import { getPhantomProvider } from '../../utils';
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import ConnectButton from '../ConnectButton';
import { WalletContext } from "../../context/WalletContext";
// import {clearWallet, updateWallet} from "../../context/walletSlice";
// import { useSelector, useDispatch } from "react-redux";
// import { updateWallet, clearWallet } from "../../context/walletSlice";

const CUSTOM_RPC_URL = 'https://winter-evocative-silence.solana-mainnet.quiknode.pro/04a5e639b0bd9ceeec758a6140dc1aa1b08f62bd';
const connection = new Connection(CUSTOM_RPC_URL);
const provider = getPhantomProvider();

const usePhantomProps = () => {
    // const wallet = useSelector((state) => state.wallet);
    // const dispatch = useDispatch();
    const { wallet, updateWallet, clearWallet } = useContext(WalletContext);
    const [publicKey, setPublicKey] = useState(null);

    // Define disconnect so we can pass it to the parent when connected
    const handleDisconnect = useCallback(async () => {
        console.log("calling phantom handleDisconnect()");
        if (!provider) return;
        try {
            await provider.disconnect();
            clearWallet();
        } catch (error) {
            console.error(error.message);
        }
    }, [clearWallet]);

    // Define connect function
    const handleConnect = useCallback(async () => {
        if (!provider) return;
        try {
            await provider.connect();
        } catch (error) {
            console.error(error.message);
        }
    }, []);

    const handleFetchSolana = useCallback(async () => {
        if (!provider) return;
        try {
            let walletPublicKey = new PublicKey(provider.publicKey.toBase58());
            console.log("walletPublicKey: ", walletPublicKey);
            // let tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletPublicKey, {
            //     programId: TOKEN_PROGRAM_ID
            // });
            // Fetch the SOL balance (in lamports) for the wallet public key
            const balanceLamports = await connection.getBalance(walletPublicKey);
            // Convert lamports to SOL
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
            let solAmount= await handleFetchSolana();
            //updateWallet('phantom', keyStr, 3, handleDisconnect);
            updateWallet({walletName: 'phantom', publicKey: keyStr, solAmount: solAmount, disconnect: handleDisconnect});
            // dispatch(updateWallet({walletName: 'phantom', publicKey: keyStr, solAmount: solAmount}))
        });

        provider.on('disconnect', () => {
            console.log('Phantom disconnected');
            setPublicKey(null);
            clearWallet();
            // dispatch(clearWallet());
        });

        provider.on('accountChanged', (pk) => {
            if (pk) {
                console.log('Switched to Phantom account:', pk.toBase58());
                setPublicKey(pk.toBase58());
            } else {
                // Attempt to reconnect if needed
                provider.connect().catch((error) => {
                    console.error(`Failed to re-connect: ${error.message}`);
                });
            }
        });

        return () => {
            provider.disconnect();
        };
    }, [clearWallet, handleDisconnect, handleFetchSolana, updateWallet]);

    return {
        publicKey,
        connectedMethods,
        handleConnect,
        handleDisconnect,
    };
};

const PhantomConnect = () => {
    // Always call the hook unconditionally.
    const phantomProps = usePhantomProps();

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
    // return <ConnectButton {...props} />;
};

export default React.memo(PhantomConnect);
