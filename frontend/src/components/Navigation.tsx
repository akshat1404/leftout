import React from 'react';
import { Link } from 'react-router-dom';

interface NavigationProps {
  cartItemCount: number;
  userName?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ cartItemCount, userName }) => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          🛒 CartReminder
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Products
          </Link>
          <Link
            to="/cart"
            className="relative text-gray-700 hover:text-blue-600 transition-colors"
          >
            Cart
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
          {userName && <span className="text-gray-700">Welcome, {userName}!</span>}
        </div>
      </div>
    </nav>
  );
};
