import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Navigation } from '../components/Navigation';
import { useCart } from '../hooks/useCart';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const cart = useCart();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setEmail(JSON.parse(user).email);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    cart.saveCart();
  }, [cart.items]);

  const fetchProducts = async () => {
    try {
      const data = await apiService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Mock products for demo
      setProducts([
        {
          id: '1',
          name: 'Laptop',
          price: 999,
          description: 'High-performance laptop',
          image: 'https://via.placeholder.com/300x200?text=Laptop',
          category: 'Electronics',
          stock: 10,
        },
        {
          id: '2',
          name: 'Wireless Mouse',
          price: 29,
          description: 'Comfortable wireless mouse',
          image: 'https://via.placeholder.com/300x200?text=Mouse',
          category: 'Accessories',
          stock: 50,
        },
        {
          id: '3',
          name: 'USB-C Cable',
          price: 15,
          description: 'Durable USB-C cable',
          image: 'https://via.placeholder.com/300x200?text=Cable',
          category: 'Cables',
          stock: 100,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmail) {
      alert('Please enter your email');
      return;
    }
    try {
      const response = await apiService.register(formEmail);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setEmail(response.user.email);
      setFormEmail('');
      setShowRegister(false);
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation cartItemCount={cart.getTotalItems()} userName={email.split('@')[0]} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!email && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Welcome!</h2>
            <p className="text-blue-800 mb-4">
              Register with your email to receive abandoned cart notifications.
            </p>
            {!showRegister ? (
              <button
                onClick={() => setShowRegister(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Register / Login
              </button>
            ) : (
              <form onSubmit={handleRegister} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Register
                </button>
              </form>
            )}
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Products</h1>
          <p className="text-gray-600">Add items to your cart and leave - we'll remind you!</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(item) => {
                  cart.addItem(item);
                  alert(`${item.productName} added to cart!`);
                }}
              />
            ))}
          </div>
        )}

        {cart.getTotalItems() > 0 && (
          <div className="fixed bottom-8 right-8">
            <button
              onClick={() => navigate('/cart')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg text-lg font-semibold transition-colors"
            >
              View Cart ({cart.getTotalItems()})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
