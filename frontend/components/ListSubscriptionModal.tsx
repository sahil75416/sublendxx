import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { api } from '../utils/api';
import { mintSubscriptionNFT } from '../utils/blockchain';

interface ListSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ListSubscriptionModal = ({ isOpen, onClose, onSuccess }: ListSubscriptionModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pricePerHour: '',
    maxDuration: '24',
    category: 'streaming'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [mintingStep, setMintingStep] = useState<string>('');

  if (!isOpen) return null;

  const subscriptionOptions = [
    { value: 'Netflix', label: 'Netflix' },
    { value: 'Spotify Premium', label: 'Spotify Premium' },
    { value: 'Canva Pro', label: 'Canva Pro' },
    { value: 'Adobe Creative Cloud', label: 'Adobe Creative Cloud' },
    { value: 'ChatGPT Plus', label: 'ChatGPT Plus' },
    { value: 'Midjourney', label: 'Midjourney' },
    { value: 'Disney+', label: 'Disney+' },
    { value: 'YouTube Premium', label: 'YouTube Premium' },
    { value: 'Other', label: 'Other' }
  ];

  const categoryOptions = [
    { value: 'streaming', label: 'Streaming' },
    { value: 'music', label: 'Music' },
    { value: 'design', label: 'Design' },
    { value: 'ai', label: 'AI Tools' },
    { value: 'productivity', label: 'Productivity' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMintingStep('');

    try {
      // Check if user is logged in
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        toast.error('Please login to list a subscription!');
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

      // Validate inputs
      if (!formData.name || !formData.pricePerHour) {
        toast.error('Please fill in all required fields!');
        setIsLoading(false);
        return;
      }

      const pricePerHour = parseFloat(formData.pricePerHour);
      if (isNaN(pricePerHour) || pricePerHour <= 0) {
        toast.error('Please enter a valid price!');
        setIsLoading(false);
        return;
      }

      // Step 1: Create metadata URI (simplified for demo)
      setMintingStep('Preparing metadata...');
      const metadata = {
        name: formData.name,
        description: formData.description || `Access to ${formData.name}`,
        category: formData.category,
        pricePerHour,
        maxDuration: parseInt(formData.maxDuration)
      };
      const metadataUri = `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;

      // Step 2: Mint NFT on blockchain
      setMintingStep('Minting NFT on Base Sepolia... Please confirm in your wallet');
      toast.info('Please confirm the transaction in your wallet');
      
      const mintResult = await mintSubscriptionNFT(
        formData.name,
        formData.description || `Access to ${formData.name}`,
        pricePerHour,
        metadataUri
      );

      if (!mintResult.success || !mintResult.tokenId) {
        throw new Error('Failed to mint NFT');
      }

      setMintingStep('NFT minted! Creating listing...');
      toast.success(`NFT minted! Token ID: ${mintResult.tokenId}`);

      // Step 3: Create listing in backend with NFT token ID
      const response = await api.createListing({
        name: formData.name,
        description: formData.description || `Access to ${formData.name}`,
        lenderAddress: walletAddress,
        pricePerMinute: pricePerHour / 60,
        pricePerHour: pricePerHour,
        maxDuration: parseInt(formData.maxDuration),
        category: formData.category,
        nftId: parseInt(mintResult.tokenId),
        transactionHash: mintResult.transactionHash
      });

      if (response.error) {
        toast.error(response.error || 'NFT minted but listing creation failed');
        return;
      }

      toast.success('✅ Subscription listed successfully on blockchain!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        pricePerHour: '',
        maxDuration: '24',
        category: 'streaming'
      });

      // Close modal after short delay
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 2000);
      
    } catch (error: any) {
      console.error('Error listing subscription:', error);
      if (error.message?.includes('user rejected')) {
        toast.error('Transaction cancelled by user');
      } else if (error.message?.includes('insufficient funds')) {
        toast.error('Insufficient ETH for gas fees. Get test ETH from Base Sepolia faucet');
      } else {
        toast.error(error.message || 'Failed to list subscription. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setMintingStep('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">List Your Subscription</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Subscription Name */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Subscription Name *
              </label>
              <select
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select a subscription</option>
                {subscriptionOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
                placeholder="Brief description of what's included..."
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categoryOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                Price per Hour ($) *
              </label>
              <input
                type="number"
                id="price"
                min="0.01"
                step="0.01"
                value={formData.pricePerHour}
                onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="5.00"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended: $2-10 per hour
              </p>
            </div>

            {/* Max Duration */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maxDuration">
                Maximum Rental Duration (hours)
              </label>
              <input
                type="number"
                id="maxDuration"
                min="1"
                max="168"
                value={formData.maxDuration}
                onChange={(e) => setFormData({ ...formData, maxDuration: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum 168 hours (1 week)
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {mintingStep || 'Processing...'}
              </>
            ) : (
              'List Subscription on Blockchain'
            )}
          </button>

          {/* Blockchain Info */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>ℹ️ Note:</strong> This will mint an NFT on Base Sepolia testnet. Make sure you have test ETH for gas fees.
            </p>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default ListSubscriptionModal;
