import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { CartItemComponent } from '../components/CartItemComponent';
import { useCart } from '../hooks/useCart';
import apiService from '../services/api';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const cart = useCart();
  const [loading, setLoading] = React.useState(false);
  const user = localStorage.getItem('user');
  const userName = user ? JSON.parse(user).email.split('@')[0] : '';

  const handleCheckout = async () => {
    if (!user) {
      alert('Please register first!');
      navigate('/');
      return;
    }

    setLoading(true);
    try {
      const cartData = await apiService.createCart(cart.items);
      // Save cart timestamp for tracking
      localStorage.setItem('cartTimestamp', new Date().toISOString());
      localStorage.setItem('cartLink', cartData.cartLink);
      alert('Cart created! You will receive an email reminder if you abandon it.');
      cart.clearCart();
      navigate('/');
    } catch (error) {
      console.error('Failed to create cart:', error);
      alert('Failed to process. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation cartItemCount={0} userName={userName} />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation cartItemCount={cart.getTotalItems()} userName={userName} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="space-y-4 mb-8">
          {cart.items.map((item) => (
            <CartItemComponent
              key={item.productId}
              item={item}
              onUpdateQuantity={cart.updateQuantity}
              onRemove={cart.removeItem}
            />
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-semibold">Subtotal:</span>
            <span className="text-2xl font-bold text-blue-600">${cart.getTotalPrice().toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-600">Items: {cart.getTotalItems()}</span>
          </div>
          <div className="border-t pt-4 flex justify-between items-center">
            <span className="text-xl font-semibold">Total:</span>
            <span className="text-3xl font-bold text-blue-600">${cart.getTotalPrice().toFixed(2)}</span>
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
            onClick={handleCheckout}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
          >
            {loading ? 'Processing...' : 'Proceed to Checkout'}
          </button>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            💡 <strong>Tip:</strong> Close this tab and leave - you'll receive an email reminder about your cart in 5 minutes!
          </p>
        </div>
      </div>
    </div>
  );
};
