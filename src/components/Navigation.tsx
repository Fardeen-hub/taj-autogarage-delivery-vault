
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">TA</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Taj Autogarage</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant={isActive('/') ? 'default' : 'ghost'}>
                Dashboard
              </Button>
            </Link>
            <Link to="/delivery-form">
              <Button variant={isActive('/delivery-form') ? 'default' : 'ghost'}>
                New Delivery
              </Button>
            </Link>
            <Link to="/search">
              <Button variant={isActive('/search') ? 'default' : 'ghost'}>
                Search Records
              </Button>
            </Link>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
