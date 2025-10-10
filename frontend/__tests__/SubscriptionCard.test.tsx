import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SubscriptionCard from '../components/SubscriptionCard';

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

describe('SubscriptionCard', () => {
  const mockProps = {
    name: 'Netflix',
    price: 5,
    duration: 'hour',
    image: '/netflix.png',
  };

  it('renders subscription information correctly', () => {
    render(<SubscriptionCard {...mockProps} />);
    
    const nameElement = screen.getByText(/Netflix/i);
    const priceElement = screen.getByText(/\$5/i);
    const durationElement = screen.getByText(/per hour/i);
    const rentButton = screen.getByText(/Rent Now/i);
    
    expect(nameElement).toBeInTheDocument();
    expect(priceElement).toBeInTheDocument();
    expect(durationElement).toBeInTheDocument();
    expect(rentButton).toBeInTheDocument();
  });
});