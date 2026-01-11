import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import apiService from '../services/api';
import { Cart } from '../types';

export const RecoverCart: React.FC = () => {
  const { cartId } = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cartId) {
      fetchCart();
    }
  }, [cartId]);

  const fetchCart = async () => {
    try {
      if (cartId) {
        const data = await apiService.getCart(cartId);
        setCart(data);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation cartItemCount={0} />
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation cartItemCount={0} />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cart Not Found</h1>
          <p className="text-gray-600 mb-8">The cart link may have expired.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors"
          >
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation cartItemCount={cart.items.length} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-green-900 mb-2">Welcome Back! 🎉</h1>
          <p className="text-green-800">Here are the items you left in your cart</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Items:</h2>
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.productId} className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="font-semibold text-gray-800">{item.productName}</h3>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">${(item.price * item.quantity).toFixed(2)}</p>
                  <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t flex justify-between items-center">
            <span className="text-xl font-semibold">Total:</span>
            <span className="text-3xl font-bold text-blue-600">${cart.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => {
              alert('Checkout feature would be implemented here!');
            }}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
          >
            Complete Purchase
          </button>
        </div>
      </div>
    </div>
  );
};
