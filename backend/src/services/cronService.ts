import cron from 'node-cron';
import { Cart } from '../models/Cart';
import { User } from '../models/User';
import { Notification } from '../models/Notification';
import { emailService } from './emailService';

const ABANDON_TIME_SECONDS = parseInt(process.env.CART_ABANDON_TIME_SECONDS || '5');

export const initializeAbandonedCartCron = (): void => {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      console.log(`🔄 Checking for abandoned carts (${new Date().toISOString()})`);

      // Calculate the time threshold (convert seconds to milliseconds)
      const abandonThresholdTime = new Date(Date.now() - ABANDON_TIME_SECONDS * 1000);

      // Find carts that are:
      // 1. Not completed
      // 2. Last updated before the threshold time
      // 3. Notification not sent yet
      const abandonedCarts = await Cart.find({
        status: { $ne: 'completed' },
        lastUpdated: { $lt: abandonThresholdTime },
        notificationSent: false,
      }).populate('userId');

      console.log(`📊 Found ${abandonedCarts.length} abandoned cart(s)`);

      for (const cart of abandonedCarts) {
        try {
          const user = cart.userId as any;

          if (!user || !user.email) {
            console.warn(`⚠️ User not found for cart ${cart._id}`);
            continue;
          }

          // Send email
          const emailResult = await emailService.sendAbandonedCartEmail(
            user.email,
            cart.items,
            cart.totalPrice,
            cart.cartLink
          );

          if (emailResult.success) {
            // Mark cart as notified
            cart.notificationSent = true;
            cart.notificationSentAt = new Date();
            await cart.save();

            // Log notification
            await Notification.create({
              cartId: cart._id,
              userId: cart.userId,
              email: user.email,
              status: 'sent',
            });

            console.log(`✅ Notification sent for cart ${cart._id} to ${user.email}`);
          } else {
            console.error(`❌ Failed to send email for cart ${cart._id}: ${emailResult.error}`);

            // Log failed notification
            await Notification.create({
              cartId: cart._id,
              userId: cart.userId,
              email: user.email,
              status: 'failed',
              response: emailResult.error,
            });
          }
        } catch (cartError) {
          console.error(`Error processing cart ${cart._id}:`, cartError);
        }
      }

      if (abandonedCarts.length === 0) {
        console.log('✅ No abandoned carts to notify');
      }
    } catch (error) {
      console.error('❌ Cron job error:', error);
    }
  });

  console.log('✅ Abandoned cart cron job initialized (runs every minute)');
};

export const stopAbandonedCartCron = (): void => {
  cron.getTasks().forEach((task) => {
    task.stop();
  });
  console.log('⏹️ Cron jobs stopped');
};
