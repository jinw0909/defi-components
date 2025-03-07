import detectEthereumProvider from '@metamask/detect-provider';

async function getMetaMaskProvider() {
    const provider = await detectEthereumProvider();
    // Check if multiple providers exist
    if (provider && provider.providers && Array.isArray(provider.providers)) {
        // Select the provider that belongs to MetaMask
        const metamaskProvider = provider.providers.find((p) => p.isMetaMask);
        if (metamaskProvider) {
            return metamaskProvider;
        }
    }
    // Fallback to the provider returned if no multiple providers are found
    return provider;
}

export default getMetaMaskProvider;
