import { Router, Response } from 'express';
import { Notification } from '../models/Notification';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

// Get notification history for user
router.get('/history', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const notifications = await Notification.find({
      userId: req.user.userId,
    })
      .populate('cartId')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(
      notifications.map((notif) => ({
        _id: notif._id,
        cartId: notif.cartId,
        email: notif.email,
        status: notif.status,
        sentAt: notif.sentAt,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: String(error) });
  }
});

// Get overall statistics (admin endpoint)
router.get('/stats/overall', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalSent = await Notification.countDocuments({ status: 'sent' });
    const totalFailed = await Notification.countDocuments({ status: 'failed' });

    res.json({
      totalSent,
      totalFailed,
      successRate: ((totalSent / (totalSent + totalFailed)) * 100).toFixed(2) + '%',
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats', error: String(error) });
  }
});

export default router;
