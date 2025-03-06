import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';

const ConnectButton = React.memo((props) => {
    const { publicKey, connectedMethods, connect, disconnect } = props;
    return(
        <div>
        {publicKey ? (
            <div>
            <button>Connected to Phantom</button>
            <div>{publicKey.toBase58()}</div>
            <button onClick={disconnect}>Disconnect</button>
            </div>
        ) : (
            <button onClick={connect}>Connect to Phantom</button>
        )}
        </div>
    )
});

export default ConnectButton;
