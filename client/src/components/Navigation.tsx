import React from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Navigation: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-primary-600">
              HousingHub
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/listings" className="text-gray-600 hover:text-gray-900">
                Browse Listings
              </Link>
              {user && (
                <>
                  <Link href="/profile/my-listings" className="text-gray-600 hover:text-gray-900">
                    My Listings
                  </Link>
                  <Link href="/create-listing" className="text-gray-600 hover:text-gray-900">
                    Create Listing
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/profile" className="text-gray-600 hover:text-gray-900">
                  Profile
                </Link>
                <Button variant="outline" onClick={signOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/signin">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 