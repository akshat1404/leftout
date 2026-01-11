import { Router, Response } from 'express';

const router = Router();

// Mock products endpoint
const mockProducts = [
  {
    id: '1',
    name: 'Laptop',
    price: 999,
    description: 'High-performance laptop for professionals',
    image: 'https://via.placeholder.com/300x200?text=Laptop',
    category: 'Electronics',
    stock: 10,
  },
  {
    id: '2',
    name: 'Wireless Mouse',
    price: 29,
    description: 'Comfortable wireless mouse with long battery life',
    image: 'https://via.placeholder.com/300x200?text=Mouse',
    category: 'Accessories',
    stock: 50,
  },
  {
    id: '3',
    name: 'USB-C Cable',
    price: 15,
    description: 'Fast charging USB-C cable',
    image: 'https://via.placeholder.com/300x200?text=Cable',
    category: 'Cables',
    stock: 100,
  },
  {
    id: '4',
    name: 'Mechanical Keyboard',
    price: 150,
    description: 'RGB mechanical keyboard for gaming',
    image: 'https://via.placeholder.com/300x200?text=Keyboard',
    category: 'Accessories',
    stock: 20,
  },
  {
    id: '5',
    name: 'Monitor',
    price: 399,
    description: '4K IPS monitor, 27 inch',
    image: 'https://via.placeholder.com/300x200?text=Monitor',
    category: 'Electronics',
    stock: 8,
  },
  {
    id: '6',
    name: 'Headphones',
    price: 199,
    description: 'Noise-cancelling wireless headphones',
    image: 'https://via.placeholder.com/300x200?text=Headphones',
    category: 'Audio',
    stock: 15,
  },
];

// Get all products
router.get('/', async (req, res: Response): Promise<void> => {
  try {
    res.json(mockProducts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: String(error) });
  }
});

// Get product by ID
router.get('/:id', async (req, res: Response): Promise<void> => {
  try {
    const product = mockProducts.find((p) => p.id === req.params.id);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error: String(error) });
  }
});

export default router;
