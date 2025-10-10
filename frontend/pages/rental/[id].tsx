import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import RentModal from '../../components/RentModal';
import { api } from '../../utils/api';

export default function RentalPage() {
  const router = useRouter();
  const { id } = router.query;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch listing data
  useEffect(() => {
    if (id) {
      fetchListing();
    }
  }, [id]);

  const fetchListing = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all listings and find the one with matching nft_id
      const listings = await api.getListings();
      const foundListing = Array.isArray(listings) 
        ? listings.find((l: any) => l.nft_id === parseInt(id as string))
        : null;

      if (foundListing) {
        setListing({
          id: foundListing.id,
          nftId: foundListing.nft_id,
          name: foundListing.name,
          lenderAddress: foundListing.lender_address,
          price: foundListing.price_per_hour,
          duration: 'hour',
          description: foundListing.description,
          category: foundListing.category,
          maxDuration: foundListing.max_duration
        });
      } else {
        setError('Subscription not found');
      }
    } catch (err) {
      console.error('Error fetching listing:', err);
      setError('Failed to load subscription');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading || !id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading subscription...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Subscription Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'This subscription is no longer available'}</p>
            <button
              onClick={() => router.push('/marketplace')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg"
            >
              Back to Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  }

  const subscription = {
    id: listing.id.toString(),
    nftId: listing.nftId,
    name: listing.name,
    lender: listing.lenderAddress,
    price: listing.price,
    duration: listing.duration,
    rating: 4.8,
    reviews: 0,
    description: listing.description,
    features: [
      'Full access to subscription',
      'Instant activation',
      'Blockchain secured',
      'Fair pricing'
    ]
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Head>
        <title>{subscription.name} - SubLendX</title>
        <meta name="description" content={`Rent ${subscription.name} subscription`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <section className="py-8">
          <button 
            className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
            onClick={() => router.back()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Marketplace
          </button>

          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:flex-shrink-0 md:w-1/3 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                <div className="text-8xl">{listing.category === 'streaming' ? '🎬' : listing.category === 'music' ? '🎵' : listing.category === 'design' ? '🎨' : listing.category === 'ai' ? '🤖' : listing.category === 'productivity' ? '📊' : listing.category === 'gaming' ? '🎮' : '📦'}</div>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{subscription.name}</h1>
                    <p className="text-sm text-gray-500 mb-2">
                      Lender: <span className="font-mono">{subscription.lender.slice(0, 6)}...{subscription.lender.slice(-4)}</span>
                    </p>
                    <div className="flex items-center mb-4">
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-1 rounded">
                        NFT #{subscription.nftId}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-indigo-600">${subscription.price}</div>
                    <div className="text-gray-600">per {subscription.duration}</div>
                  </div>
                </div>

                <p className="mt-4 text-gray-600">{subscription.description}</p>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Features:</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {subscription.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <button 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Rent Subscription
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <RentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subscription={subscription}
      />

      <footer className="bg-white py-8 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 SubLendX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}