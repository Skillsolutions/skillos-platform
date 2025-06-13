'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the session structure to match NextAuth's session
interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
}

interface MockSession {
  user: User;
  expires: string;
}

interface MockAuthContextType {
  data: { user: User } | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
}

// Create a context for the mock auth with default values that are always defined
const MockAuthContext = createContext<MockAuthContextType>({
  data: {
    user: {
      id: '1',
      name: 'Demo User',
      email: 'demo@skillsolutions.io',
      image: '/images/avatars/demo-avatar.jpg',
      role: 'admin'
    }
  },
  status: 'authenticated'
});

// Mock session data
const mockUser: User = {
  id: '1',
  name: 'Demo User',
  email: 'demo@skillsolutions.io',
  image: '/images/avatars/demo-avatar.jpg',
  role: 'admin'
};

// Provider component
export function MockSessionProvider({ children }: { children: ReactNode }) {
  // Initialize with defined values to prevent undefined during static build
  const [session, setSession] = useState<MockAuthContextType>({
    data: { user: mockUser },
    status: 'authenticated'
  });

  // No need for useEffect for static mockup - always return authenticated
  // This ensures static export works without client-side effects

  return (
    <MockAuthContext.Provider value={session}>
      {children}
    </MockAuthContext.Provider>
  );
}

// Hook to use the mock session (replacement for useSession)
// Always returns a defined object to prevent destructuring errors
export function useSession() {
  const context = useContext(MockAuthContext);
  // Ensure we always return a defined object even if context is somehow undefined
  return context || {
    data: {
      user: mockUser
    },
    status: 'authenticated'
  };
}

// Mock signIn function
export function signIn() {
  console.log('Mock sign in called');
  return Promise.resolve({ ok: true, error: null });
}

// Mock signOut function
export function signOut() {
  console.log('Mock sign out called');
  return Promise.resolve({ ok: true });
}
