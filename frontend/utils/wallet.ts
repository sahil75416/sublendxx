import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import { BrowserProvider, Contract, Signer } from 'ethers';

let provider: BrowserProvider | null = null;
let coinbaseWallet: any = null;

export const initializeWallet = () => {
  const APP_NAME = 'SubLendX';
  const APP_LOGO_URL = 'https://example.com/logo.png';
  const DEFAULT_CHAIN_ID = 84532; // Base Sepolia

  const coinbaseWalletSDK = new CoinbaseWalletSDK({
    appName: APP_NAME,
    appLogoUrl: APP_LOGO_URL,
  });

  coinbaseWallet = coinbaseWalletSDK.makeWeb3Provider({
    options: 'all',
  });

  provider = new BrowserProvider(coinbaseWallet, 'any');
  return provider;
};

export const connectWallet = async () => {
  if (!provider) {
    initializeWallet();
  }

  try {
    const accounts = await coinbaseWallet.request({
      method: 'eth_requestAccounts',
    });
    
    const signer = await provider!.getSigner();
    const network = await provider!.getNetwork();
    
    return {
      accounts,
      signer,
      network,
      provider: provider!, // Return BrowserProvider, not coinbaseWallet
      rawProvider: coinbaseWallet, // Keep raw provider for requests
    };
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    throw error;
  }
};

export const disconnectWallet = async () => {
  try {
    if (coinbaseWallet) {
      await coinbaseWallet.disconnect();
    }
    provider = null;
    coinbaseWallet = null;
  } catch (error) {
    console.error('Failed to disconnect wallet:', error);
  }
};

export const getContract = (address: string, abi: any, signer: Signer) => {
  return new Contract(address, abi, signer);
};