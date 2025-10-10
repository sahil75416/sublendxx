import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { disconnectWallet } from '../utils/wallet';
import { api } from '../utils/api';
import { toast } from 'react-toastify';
import WalletConnectModal from './WalletConnectModal';

const Navbar = () => {
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  useEffect(() => {
    // Load user data and wallet address from localStorage on component mount
    const savedAddress = localStorage.getItem('walletAddress');
    const savedEmail = localStorage.getItem('userEmail');
    const savedName = localStorage.getItem('userName');
    
    if (savedAddress) {
      setWalletAddress(savedAddress);
    }
    if (savedEmail) {
      setUserEmail(savedEmail);
      setUserName(savedName || savedEmail.split('@')[0]);
    }
  }, []);

  const handleConnectWallet = () => {
    setShowWalletModal(true);
  };

  const handleWalletConnected = (address: string) => {
    setWalletAddress(address);
  };

  const handleDisconnectWallet = async () => {
    try {
      await disconnectWallet();
      setWalletAddress(null);
      localStorage.removeItem('walletAddress');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('authToken');
      setUserEmail(null);
      setUserName(null);
      setShowUserMenu(false);
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div 
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 cursor-pointer"
          onClick={() => router.push('/')}
        >
          SubLendX
        </div>
        
        <div className="flex items-center space-x-6">
          <button 
            className="text-gray-600 hover:text-indigo-600 transition duration-300"
            onClick={() => router.push('/marketplace')}
          >
            Marketplace
          </button>
          <button 
            className="text-gray-600 hover:text-indigo-600 transition duration-300"
            onClick={() => router.push('/my-subscriptions')}
          >
            My Subscriptions
          </button>

          {/* User Menu or Login/Signup */}
          {userEmail ? (
            <div className="relative">
              <button 
                className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition duration-300"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  {userName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="font-medium">{userName}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500">{userEmail}</p>
                  </div>
                  <button
                    onClick={() => { setShowUserMenu(false); router.push('/my-subscriptions'); }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Subscriptions
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <button 
                className="text-gray-600 hover:text-indigo-600 font-medium transition duration-300"
                onClick={() => router.push('/login')}
              >
                Login
              </button>
              <button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition duration-300"
                onClick={() => router.push('/signup')}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Wallet Connection */}
          {walletAddress ? (
            <div className="flex items-center space-x-2 pl-4 border-l">
              <span className="text-gray-700 font-medium text-sm">
                {formatAddress(walletAddress)}
              </span>
              <button 
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-full text-sm transition duration-300"
                onClick={handleDisconnectWallet}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button 
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-full transition duration-300 text-sm"
              onClick={handleConnectWallet}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>

      {/* Wallet Connect Modal */}
      <WalletConnectModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onSuccess={handleWalletConnected}
      />
    </nav>
  );
};

export default Navbar;