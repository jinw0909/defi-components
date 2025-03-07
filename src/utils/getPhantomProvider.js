import detectEthereumProvider from '@metamask/detect-provider';

const getPhantomProvider = () => {
    if ('phantom' in window) {
        const anyWindow = window;
        const provider = anyWindow.phantom?.solana;

        if (provider?.isPhantom) {
            return provider;
        }
    }

    // window.open('https://phantom.app/', '_blank');
}

export default getPhantomProvider;