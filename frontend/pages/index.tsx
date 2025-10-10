import React from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import SubscriptionCard from '../components/SubscriptionCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Head>
        <title>SubLendX - Rent Digital Subscriptions</title>
        <meta name="description" content="Pay per use, not per month" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <section className="text-center py-12">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-4">
            Pay per use, not per month
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Rent unused portions of your digital subscriptions and save money by paying only for what you use.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => window.location.href = '/marketplace'}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full transition duration-300"
            >
              Browse Rentals
            </button>
            <button 
              onClick={() => window.location.href = '/my-subscriptions'}
              className="bg-white hover:bg-gray-100 text-indigo-600 font-bold py-3 px-6 rounded-full border border-indigo-600 transition duration-300"
            >
              My Subscriptions
            </button>
          </div>
        </section>

        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-8">Popular Subscriptions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SubscriptionCard 
              id={1}
              name="Netflix" 
              price={5} 
              duration="hour" 
              image="/netflix.png" 
            />
            <SubscriptionCard 
              id={2}
              name="Spotify Premium" 
              price={3} 
              duration="hour" 
              image="/spotify.png" 
            />
            <SubscriptionCard 
              id={3}
              name="Canva Pro" 
              price={2} 
              duration="hour" 
              image="/canva.png" 
            />
          </div>
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