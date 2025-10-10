const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

export const api = {
  // Listings
  getListings: async () => {
    const response = await fetch(`${API_BASE_URL}/rent/listings`);
    return response.json();
  },
  getListing: async (id: string | number) => {
    const response = await fetch(`${API_BASE_URL}/rent/listings/${id}`);
    return response.json();
  },
  
  createListing: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/rent/listing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  deleteListing: async (id: string | number) => {
    const response = await fetch(`${API_BASE_URL}/rent/listing/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  // Rentals
  createRental: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/rent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getRental: async (id: string | number) => {
    const response = await fetch(`${API_BASE_URL}/rent/${id}`);
    return response.json();
  },

  cancelRental: async (id: string | number) => {
    const response = await fetch(`${API_BASE_URL}/rent/${id}/cancel`, {
      method: 'POST',
    });
    return response.json();
  },

  // x402 Payments
  processPayment: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/x402/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  verifyAccessToken: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/x402/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getUserRentedSubscriptions: async (address: string) => {
    const response = await fetch(`${API_BASE_URL}/rent/user/${address}/rented`);
    return response.json();
  },

  getUserLentSubscriptions: async (address: string) => {
    const response = await fetch(`${API_BASE_URL}/rent/user/${address}/lent`);
    return response.json();
  },

  // Authentication
  signup: async (data: { name: string; email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  login: async (data: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  logout: async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  verifyToken: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  linkWallet: async (walletAddress: string) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/auth/link-wallet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ walletAddress }),
    });
    return response.json();
  },

  getProfile: async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },
};