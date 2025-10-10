import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import SubscriptionCard from '../components/SubscriptionCard';
import { api } from '../utils/api';
import { toast } from 'react-toastify';

interface Listing {
  id: number;
  nftId: number;
  name: string;
  description: string;
  lenderAddress: string;
  pricePerHour: number;
  maxDuration: number;
  category: string;
  isActive: boolean;
  transactionHash?: string;
}

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const response = await api.getListings();
      // Backend returns array directly with snake_case, map to camelCase
      if (Array.isArray(response)) {
        const mappedListings = response.map((item: any) => ({
          id: item.id,
          nftId: item.nft_id,
          name: item.name,
          description: item.description,
          lenderAddress: item.lender_address,
          pricePerHour: item.price_per_hour,
          maxDuration: item.max_duration,
          category: item.category,
          isActive: item.active
        }));
        setListings(mappedListings);
      } else if (response.listings) {
        setListings(response.listings);
      } else {
        setListings([]);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to load marketplace listings');
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscriptions = listings.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || sub.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'streaming', label: 'Streaming' },
    { value: 'music', label: 'Music' },
    { value: 'design', label: 'Design' },
    { value: 'ai', label: 'AI Tools' },
    { value: 'productivity', label: 'Productivity' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Head>
        <title>Marketplace - SubLendX</title>
        <meta name="description" content="Browse available digital subscriptions for rent" />
      </Head>

      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <section className="py-8">
          <h1 className="text-4xl font-bold text-center mb-4">Subscription Marketplace</h1>
          <p className="text-center text-gray-600 mb-8">
            Rent subscriptions listed on Ethereum Sepolia blockchain
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search subscriptions..."
                className="w-full p-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="absolute right-3 top-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full transition duration-300">
                Search
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex justify-center mb-8 flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-full font-medium transition duration-300 ${
                  selectedCategory === cat.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600">Loading marketplace...</p>
            </div>
          ) : filteredSubscriptions.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {searchTerm || selectedCategory !== 'all' ? 'No subscriptions found' : 'No subscriptions available yet'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Be the first to list a subscription!'}
              </p>
              {!searchTerm && selectedCategory === 'all' && (
                <a href="/my-subscriptions" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full transition duration-300">
                  List Your Subscription
                </a>
              )}
            </div>
          ) : (
            /* Listings Grid */
            <>
              <div className="text-center mb-4">
                <p className="text-gray-600">
                  {filteredSubscriptions.length} subscription{filteredSubscriptions.length !== 1 ? 's' : ''} available
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSubscriptions.map(sub => (
                  <SubscriptionCard 
                    key={sub.id}
                    id={sub.nftId}
                    name={sub.name}
                    price={sub.pricePerHour}
                    duration="hour"
                    image={`/subscriptions/${sub.category}.png`}
                    nftId={sub.nftId}
                    lenderAddress={sub.lenderAddress}
                    description={sub.description}
                    category={sub.category}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      <footer className="bg-white py-8 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 SubLendX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}