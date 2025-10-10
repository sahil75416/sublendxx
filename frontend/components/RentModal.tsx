import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { api } from '../utils/api';
import { createRental } from '../utils/blockchain';
import { getUSDCBalance } from '../utils/contracts';
import { connectWallet } from '../utils/wallet';

interface Subscription {
  id: string | number;
  name: string;
  price: number;
  duration: string;
  nftId?: number;
  lenderAddress?: string;
}

interface RentModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription;
}

const RentModal = ({ isOpen, onClose, subscription }: RentModalProps) => {
  const [duration, setDuration] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [rentingStep, setRentingStep] = useState<string>('');
  const [usdcBalance, setUsdcBalance] = useState<string | null>(null);

  const totalPrice = subscription.price * duration;

  const checkBalance = async () => {
    try {
      const walletAddress = localStorage.getItem('walletAddress');
      if (walletAddress) {
        const { signer } = await connectWallet();
        const balance = await getUSDCBalance(signer);
        setUsdcBalance(balance);
      }
    } catch (error) {
      console.error('Error checking balance:', error);
    }
  };

  // Check USDC balance when modal opens
  useEffect(() => {
    if (isOpen) {
      checkBalance();
    }
  }, [isOpen]);

  // Return null AFTER all hooks
  if (!isOpen) return null;

  const handleRent = async () => {
    setIsLoading(true);
    setRentingStep('');
    
    try {
      // Check if user is logged in
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        toast.error('Please login to rent a subscription!');
        setIsLoading(false);
        return;
      }

      // Get wallet address from localStorage
      const walletAddress = localStorage.getItem('walletAddress');
      
      if (!walletAddress) {
        toast.error('Please connect your wallet first!');
        setIsLoading(false);
        return;
      }

      if (!subscription.nftId) {
        toast.error('Invalid subscription NFT ID');
        setIsLoading(false);
        return;
      }

      // Calculate duration in minutes
      const durationInMinutes = subscription.duration === 'hour' ? duration * 60 : duration;

      // Step 1: Check USDC balance
      setRentingStep('Checking USDC balance...');
      const balance = parseFloat(usdcBalance || '0');
      if (balance < totalPrice) {
        toast.error(`Insufficient USDC! You need ${totalPrice} USDC but have ${balance} USDC. Get test USDC from faucet.`);
        setIsLoading(false);
        return;
      }

      // Step 2: Approve USDC and create rental on blockchain
      setRentingStep('Please approve USDC spending in your wallet...');
      toast.info('Step 1: Approve USDC spending');
      
      // Wait a moment for user to see the message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRentingStep('Creating rental on Ethereum Sepolia...');
      toast.info('Step 2: Confirm rental transaction');

      const rentalResult = await createRental(
        subscription.nftId,
        durationInMinutes,
        totalPrice
      );

      if (!rentalResult.success) {
        throw new Error('Failed to create rental on blockchain');
      }

      setRentingStep('Rental created! Updating backend...');
      toast.success(`Rental created! TX: ${rentalResult.transactionHash?.slice(0, 10)}...`);

      // Step 3: Create rental record in backend
      const response = await api.createRental({
        nftId: subscription.nftId,
        borrowerAddress: walletAddress,
        durationInMinutes: durationInMinutes,
        transactionHash: rentalResult.transactionHash
      });

      if (response.error) {
        toast.warning('Rental created on blockchain but backend update failed');
      } else {
        toast.success('✅ Subscription rented successfully! Access granted.');
      }
      
      // Close modal after delay
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error: any) {
      console.error('Error renting subscription:', error);
      if (error.message?.includes('user rejected')) {
        toast.error('Transaction cancelled by user');
      } else if (error.message?.includes('insufficient funds') || error.message?.includes('Insufficient USDC')) {
        toast.error('Insufficient USDC balance. Get test USDC from Base Sepolia faucet.');
      } else {
        toast.error(error.message || 'Failed to rent subscription. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setRentingStep('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Rent {subscription.name}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
              Duration (in {subscription.duration}s)
            </label>
            <div className="flex items-center">
              <button 
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-l"
                onClick={() => setDuration(Math.max(1, duration - 1))}
              >
                -
              </button>
              <input
                type="number"
                id="duration"
                min="1"
                value={duration}
                onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-center border-t border-b border-gray-300 py-2"
              />
              <button 
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-r"
                onClick={() => setDuration(duration + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Price per {subscription.duration}:</span>
              <span className="font-medium">${subscription.price} USDC</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{duration} {subscription.duration}{duration > 1 ? 's' : ''}</span>
            </div>
            {usdcBalance !== null && (
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Your USDC Balance:</span>
                <span className={`font-medium ${parseFloat(usdcBalance) >= totalPrice ? 'text-green-600' : 'text-red-600'}`}>
                  {usdcBalance} USDC
                </span>
              </div>
            )}
            <div className="border-t border-gray-300 pt-2 flex justify-between">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-lg font-bold text-indigo-600">${totalPrice} USDC</span>
            </div>
          </div>

          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center disabled:opacity-50"
            onClick={handleRent}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {rentingStep || 'Processing...'}
              </>
            ) : (
              'Rent with USDC on Blockchain'
            )}
          </button>

          {/* Blockchain Info */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>ℹ️ Note:</strong> Payment will be made in USDC on Ethereum Sepolia testnet. Make sure you have test USDC in your wallet.
            </p>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default RentModal;