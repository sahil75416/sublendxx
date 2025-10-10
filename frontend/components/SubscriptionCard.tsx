import React from 'react';
import { useRouter } from 'next/router';

interface SubscriptionCardProps {
  id: number;
  name: string;
  price: number;
  duration: string;
  image?: string;
  nftId?: number;
  lenderAddress?: string;
  description?: string;
  category?: string;
}

const SubscriptionCard = ({ id, name, price, duration, image, nftId, lenderAddress, description, category }: SubscriptionCardProps) => {
  const router = useRouter();

  // Get category emoji
  const getCategoryEmoji = (cat?: string) => {
    const emojiMap: { [key: string]: string } = {
      streaming: '🎬',
      music: '🎵',
      design: '🎨',
      ai: '🤖',
      productivity: '📊',
      gaming: '🎮',
      other: '📦'
    };
    return emojiMap[cat || 'other'] || '📦';
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 border border-gray-200">
      <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
        <div className="text-6xl">{getCategoryEmoji(category)}</div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold">{name}</h3>
          {nftId !== undefined && (
            <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-1 rounded">
              NFT #{nftId}
            </span>
          )}
        </div>
        
        {description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        )}
        
        <p className="text-gray-600 mb-4">
          <span className="text-2xl font-bold text-indigo-600">${price}</span> per {duration}
        </p>

        {lenderAddress && (
          <p className="text-xs text-gray-500 mb-4">
            Lender: {lenderAddress.slice(0, 6)}...{lenderAddress.slice(-4)}
          </p>
        )}
        
        <button 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          onClick={() => router.push(`/rental/${nftId || id}`)}
        >
          Rent Now
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCard;