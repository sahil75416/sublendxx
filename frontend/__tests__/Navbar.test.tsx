import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from '../components/Navbar';

// Mock useRouter
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
    };
  },
}));

describe('Navbar', () => {
  it('renders the SubLendX logo', () => {
    render(<Navbar />);
    const logoElement = screen.getByText(/SubLendX/i);
    expect(logoElement).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Navbar />);
    const marketplaceLink = screen.getByText(/Marketplace/i);
    const mySubscriptionsLink = screen.getByText(/My Subscriptions/i);
    const connectWalletButton = screen.getByText(/Connect Wallet/i);
    
    expect(marketplaceLink).toBeInTheDocument();
    expect(mySubscriptionsLink).toBeInTheDocument();
    expect(connectWalletButton).toBeInTheDocument();
  });
});