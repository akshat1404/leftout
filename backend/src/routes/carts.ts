import { Router, Response } from 'express';
import { Cart } from '../models/Cart';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

// Create/Update cart
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      res.status(400).json({ message: 'Items array is required' });
      return;
    }

    // Calculate total price
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create new cart
    const cart = new Cart({
      userId: req.user.userId,
      items,
      totalPrice,
      status: 'active',
      lastUpdated: new Date(),
    });

    await cart.save();

    res.status(201).json({
      _id: cart._id,
      userId: cart.userId,
      items: cart.items,
      totalPrice: cart.totalPrice,
      status: cart.status,
      createdAt: cart.createdAt,
      cartLink: cart.cartLink,
    });
  } catch (error) {
    console.error('Create cart error:', error);
    res.status(500).json({ message: 'Failed to create cart', error: String(error) });
  }
});

// Get cart by ID
router.get('/:cartId', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { cartId } = req.params;

    const cart = await Cart.findById(cartId);

    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    res.json({
      _id: cart._id,
      userId: cart.userId,
      items: cart.items,
      totalPrice: cart.totalPrice,
      status: cart.status,
      createdAt: cart.createdAt,
      lastUpdated: cart.lastUpdated,
      notificationSent: cart.notificationSent,
      cartLink: cart.cartLink,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cart', error: String(error) });
  }
});

// Get carts by cart link (for recovery)
router.get('/link/:cartLink', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { cartLink } = req.params;

    const cart = await Cart.findOne({ cartLink });

    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    res.json({
      _id: cart._id,
      userId: cart.userId,
      items: cart.items,
      totalPrice: cart.totalPrice,
      status: cart.status,
      createdAt: cart.createdAt,
      lastUpdated: cart.lastUpdated,
      cartLink: cart.cartLink,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cart', error: String(error) });
  }
});

// Get user's carts
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const carts = await Cart.find({ userId: req.user.userId }).sort({ createdAt: -1 });

    res.json(
      carts.map((cart) => ({
        _id: cart._id,
        userId: cart.userId,
        items: cart.items,
        totalPrice: cart.totalPrice,
        status: cart.status,
        createdAt: cart.createdAt,
        lastUpdated: cart.lastUpdated,
        notificationSent: cart.notificationSent,
        cartLink: cart.cartLink,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch carts', error: String(error) });
  }
});

// Update cart
router.put('/:cartId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { cartId } = req.params;
    const { items } = req.body;

    const cart = await Cart.findById(cartId);

    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    if (cart.userId.toString() !== req.user.userId) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    // Calculate total price
    const totalPrice = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    cart.items = items;
    cart.totalPrice = totalPrice;
    cart.lastUpdated = new Date();
    cart.notificationSent = false; // Reset notification flag

    await cart.save();

    res.json({
      _id: cart._id,
      userId: cart.userId,
      items: cart.items,
      totalPrice: cart.totalPrice,
      status: cart.status,
      createdAt: cart.createdAt,
      lastUpdated: cart.lastUpdated,
      cartLink: cart.cartLink,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update cart', error: String(error) });
  }
});

// Complete cart (purchase)
router.put(
  '/:cartId/complete',
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const { cartId } = req.params;

      const cart = await Cart.findById(cartId);

      if (!cart) {
        res.status(404).json({ message: 'Cart not found' });
        return;
      }

      cart.status = 'completed';
      await cart.save();

      res.json({
        _id: cart._id,
        userId: cart.userId,
        items: cart.items,
        totalPrice: cart.totalPrice,
        status: cart.status,
        createdAt: cart.createdAt,
        lastUpdated: cart.lastUpdated,
        cartLink: cart.cartLink,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to complete cart', error: String(error) });
    }
  }
);

// Delete cart
router.delete(
  '/:cartId',
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const { cartId } = req.params;

      const cart = await Cart.findById(cartId);

      if (!cart) {
        res.status(404).json({ message: 'Cart not found' });
        return;
      }

      if (cart.userId.toString() !== req.user.userId) {
        res.status(403).json({ message: 'Unauthorized' });
        return;
      }

      await Cart.deleteOne({ _id: cartId });

      res.json({ message: 'Cart deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete cart', error: String(error) });
    }
  }
);

export default router;
