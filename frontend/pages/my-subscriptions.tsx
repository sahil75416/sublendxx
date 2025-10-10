import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import ListSubscriptionModal from '../components/ListSubscriptionModal';
import { api } from '../utils/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MySubscriptions() {
  const [activeTab, setActiveTab] = useState('lent');
  const [lentSubscriptions, setLentSubscriptions] = useState([]);
  const [rentedSubscriptions, setRentedSubscriptions] = useState([]);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  useEffect(() => {
    // Get wallet address from localStorage or state management
    const storedAddress = localStorage.getItem('walletAddress');
    setWalletAddress(storedAddress);

    if (storedAddress) {
      fetchSubscriptions(storedAddress);
    }
  }, []);

  const fetchSubscriptions = async (address: string) => {
    setLoading(true);
    try {
      const [lent, rented] = await Promise.all([
        api.getUserLentSubscriptions(address),
        api.getUserRentedSubscriptions(address)
      ]);
      
      // Ensure we always set arrays, even if API returns error
      setLentSubscriptions(Array.isArray(lent) ? lent : []);
      setRentedSubscriptions(Array.isArray(rented) ? rented : []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      // Set empty arrays on error
      setLentSubscriptions([]);
      setRentedSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimeRemaining = (endTime: string) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  const handleDeleteListing = async (listingId: number, listingName?: string) => {
    const message = listingName 
      ? `Are you sure you want to unlist "${listingName}"?\n\nThis will remove it from the marketplace. You can list it again anytime.`
      : 'Are you sure you want to unlist this subscription?\n\nThis will remove it from the marketplace.';
    
    if (!confirm(message)) return;

    toast.info('Removing listing...');

    try {
      const response = await api.deleteListing(listingId);
      if (response.success) {
        toast.success('✅ Listing removed from marketplace!');
        if (walletAddress) {
          fetchSubscriptions(walletAddress);
        }
      } else {
        toast.error('Failed to remove listing');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error('Failed to remove listing. Please try again.');
    }
  };

  const handleListingSuccess = () => {
    if (walletAddress) {
      fetchSubscriptions(walletAddress);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Head>
        <title>My Subscriptions - SubLendX</title>
        <meta name="description" content="Manage your lent and rented subscriptions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <section className="py-8">
          <h1 className="text-4xl font-bold text-center mb-8">My Subscriptions</h1>
          
          {!walletAddress && (
            <div className="max-w-4xl mx-auto text-center py-12">
              <p className="text-gray-600 text-lg">Please connect your wallet to view your subscriptions</p>
            </div>
          )}

          {walletAddress && (
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <div className="flex border-b border-gray-200">
                  <button
                    className={`py-2 px-4 font-medium text-sm ${activeTab === 'lent' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('lent')}
                  >
                    Subscriptions I'm Lending ({lentSubscriptions.length})
                  </button>
                  <button
                    className={`py-2 px-4 font-medium text-sm ${activeTab === 'rented' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('rented')}
                  >
                    Subscriptions I'm Renting ({rentedSubscriptions.length})
                  </button>
                </div>
                {activeTab === 'lent' && (
                  <button
                    onClick={() => setIsListModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    List Subscription
                  </button>
                )}
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                  <p className="mt-4 text-gray-600">Loading subscriptions...</p>
                </div>
              ) : activeTab === 'lent' ? (
                <>
                  {lentSubscriptions.length > 0 && (
                    <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-sm text-blue-800">
                            <strong>Manage your listings:</strong> Click "Unlist" to remove a subscription from the marketplace. 
                            The NFT stays in your wallet, and you can list it again anytime.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  {lentSubscriptions.length === 0 ? (
                    <div className="text-center py-12">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="mt-4 text-gray-500 text-lg">No subscriptions listed yet</p>
                      <p className="mt-2 text-gray-400 text-sm">Click "List Subscription" to start earning!</p>
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Hour</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Duration</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {lentSubscriptions.map((listing: any) => (
                          <tr key={listing.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{listing.name}</div>
                              <div className="text-xs text-gray-500">{listing.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500 capitalize">{listing.category}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">${listing.price_per_hour?.toFixed(2) || (listing.price_per_minute * 60).toFixed(2)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{listing.max_duration}h</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                listing.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {listing.active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleDeleteListing(listing.id, listing.name)}
                                className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-400 transition duration-200"
                                title="Remove listing from marketplace"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Unlist
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  {rentedSubscriptions.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      No subscriptions being rented
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lender</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Left</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {rentedSubscriptions.map((sub: any) => (
                          <tr key={sub.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{sub.listings?.name || 'NFT #' + sub.nft_id}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{formatAddress(sub.lender_address)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">${sub.total_amount}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{sub.duration_minutes} min</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                sub.status === 'active' ? 'bg-green-100 text-green-800' : 
                                sub.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                sub.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {sub.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {sub.end_time ? formatTimeRemaining(sub.end_time) : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <footer className="bg-white py-8 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 SubLendX. All rights reserved.</p>
        </div>
      </footer>

      <ListSubscriptionModal 
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        onSuccess={handleListingSuccess}
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}