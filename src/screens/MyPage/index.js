import React, {useState, useEffect, useCallback, useMemo, useContext} from 'react';
import { WalletContext } from "../../context/WalletContext";
import { useSelector } from "react-redux";
import styled from 'styled-components';

const StyledMyPage = styled.main`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 100vh;
    @media (max-width: 768px) {
        flex-direction: column;
    }
`

const MyPage = () => {
    const { wallet } = useContext(WalletContext);
    // const wallet = useSelector((state) => state.wallet);

    return (
        <StyledMyPage>
            <div>
                <h1>My Page</h1>
                {wallet ? (
                    <div>
                        <p>Connected wallet: {wallet.walletName}</p>
                        <p>Public Key: {wallet.publicKey}</p>
                    </div>
                ) : (
                    <p>No wallet connected.</p>
                )}
            </div>
        </StyledMyPage>
    );
}

export default MyPage;