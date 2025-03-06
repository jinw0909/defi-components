import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';

const Button = React.memo((props) => {
    const { publicKey, connectedMethods, connect, disconnect } = props;
    return(
            <button onClick={connect}>Connect to Phantom</button>
    )
});

export default Button;
