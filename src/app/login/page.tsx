"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useState } from 'react';

const LoginPage = () => {
  const router = useRouter(); // Initialize router
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    setIsLoading(true);
    // Simulate API call or authentication
    setTimeout(() => {
      // For mock purposes, directly redirect to the platform dashboard
      router.push('/platform/dashboard');
    }, 1000); // Simulate a short delay
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-6 py-12 flex items-center justify-center min-h-[calc(100vh-150px)]">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login to SkillOS</h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                required 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                placeholder="you@example.com" 
                defaultValue="user@skillos.com" // Pre-fill for demo
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input 
                type="password" 
                name="password" 
                id="password" 
                required 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                placeholder="••••••••" 
                defaultValue="password" // Pre-fill for demo
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Forgot your password?</a>
              </div>
            </div>

            <div>
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">Or sign in with your corporate account:</p>
            <button 
              type="button" 
              className="mt-2 w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 disabled:opacity-50"
              onClick={() => router.push('/platform/dashboard')} // Also redirect for SSO button for demo
              disabled={isLoading}
            >
              Sign In with SSO
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              New to SkillOS? <Link href="/demo-request" className="font-medium text-blue-600 hover:text-blue-500">Book a Demo</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default LoginPage;

