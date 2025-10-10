import React, { useState, useEffect } from 'react';
import { connectWallet } from '../utils/wallet';
import { api } from '../utils/api';
import { toast } from 'react-toastify';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (walletAddress: string) => void;
}

export default function WalletConnectModal({ isOpen, onClose, onSuccess }: WalletConnectModalProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [step, setStep] = useState<'auth' | 'wallet'>('auth');
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
      setStep('wallet');
    } else {
      setStep('auth');
    }
  }, [isOpen]);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      // Connect to Coinbase Wallet
      const { accounts, provider } = await connectWallet();
      
      if (accounts && accounts.length > 0) {
        const walletAddress = accounts[0];
        
        // If user is logged in, link wallet to account
        if (userEmail) {
          const token = localStorage.getItem('authToken');
          if (token) {
            try {
              await api.linkWallet(walletAddress);
              toast.success('Wallet linked to your account!');
            } catch (error) {
              console.error('Failed to link wallet:', error);
              toast.warning('Wallet connected but not linked to account');
            }
          }
        }
        
        // Store wallet address
        localStorage.setItem('walletAddress', walletAddress);
        
        toast.success('Wallet connected successfully!');
        onSuccess(walletAddress);
        onClose();
      }
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      toast.error(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 'auth' ? 'Login Required' : 'Connect Wallet'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        {step === 'auth' ? (
          <div className="text-center">
            <div className="mb-6">
              <svg className="mx-auto h-16 w-16 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-6">
              You need to create an account or login before connecting your wallet for security purposes.
            </p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => {
                  onClose();
                  window.location.href = '/signup';
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
              >
                Create Account
              </button>
              <button
                onClick={() => {
                  onClose();
                  window.location.href = '/login';
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg transition duration-300"
              >
                Login
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">
                  {userEmail?.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-600">Logged in as</p>
              <p className="font-medium text-gray-900">{userEmail}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Connect to Base Sepolia</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Your wallet will be linked to your account</li>
                <li>✓ Transactions on Base Sepolia testnet</li>
                <li>✓ Use test ETH (free from faucet)</li>
                <li>✓ Secure smart contract integration</li>
              </ul>
            </div>

            <button
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center disabled:opacity-50"
            >
              {isConnecting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  Connect Coinbase Wallet
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Make sure you have Coinbase Wallet installed and set to Base Sepolia network
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
