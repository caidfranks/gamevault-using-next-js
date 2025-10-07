'use client';

import { useState, useEffect } from 'react';
import { onAuthChange, logOut } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  // Redirect pending vendors
  if (user && user.role === 'pending_vendor') {
    router.push('/pending-approval');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">GameVault</h1>
              {user && user.role && (
                <span className="ml-4 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {user.role === 'customer' && 'Customer'}
                  {user.role === 'vendor' && 'Vendor'}
                  {user.role === 'admin' && 'Admin'}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-gray-700">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-blue-600 hover:text-blue-800"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup/customer"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {user ? (
            <>
              {/* Customer View */}
              {user.role === 'customer' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Welcome to GameVault!
                  </h2>
                  <p className="text-gray-600 mb-4">
                    You are logged in as a customer: <strong>{user.email}</strong>
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Customer Features:</h3>
                    <ul className="list-disc list-inside text-blue-800 space-y-1">
                      <li>Browse and search game listings</li>
                      <li>Add games to cart</li>
                      <li>Purchase games</li>
                      <li>View order history</li>
                    </ul>
                  </div>
                  <p className="text-gray-500 text-sm">
                    Game listings coming soon...
                  </p>
                </div>
              )}

              {/* Vendor View */}
              {user.role === 'vendor' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Vendor Dashboard
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Welcome back, <strong>{user.vendorInfo?.displayName || user.email}</strong>
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                    <h3 className="font-semibold text-green-900 mb-2">Vendor Features:</h3>
                    <ul className="list-disc list-inside text-green-800 space-y-1">
                      <li>Create and manage game listings</li>
                      <li>View and fulfill orders</li>
                      <li>Manage returns</li>
                      <li>Track sales</li>
                    </ul>
                  </div>
                  <p className="text-gray-500 text-sm">
                    Listing management coming soon...
                  </p>
                </div>
              )}

              {/* Admin View */}
              {user.role === 'admin' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Admin Dashboard
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Admin: <strong>{user.email}</strong>
                  </p>
                  <div className="bg-purple-50 border border-purple-200 rounded-md p-4 mb-4">
                    <h3 className="font-semibold text-purple-900 mb-2">Admin Features:</h3>
                    <ul className="list-disc list-inside text-purple-800 space-y-1">
                      <li>Approve/deny vendor applications</li>
                      <li>Approve/deny product listings</li>
                      <li>Manage users and ban accounts</li>
                      <li>View activity logs</li>
                    </ul>
                  </div>
                  <p className="text-gray-500 text-sm">
                    Admin tools coming soon...
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to GameVault
              </h2>
              <p className="text-gray-600 mb-6">
                Your marketplace for buying and selling video game keys
              </p>
              <div className="flex justify-center space-x-4">
                <Link
                  href="/signup/customer"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Sign Up as Customer
                </Link>
                <Link
                  href="/signup/vendor"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Apply as Vendor
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}