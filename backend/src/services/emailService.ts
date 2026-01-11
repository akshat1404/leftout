import dotenv from 'dotenv';
import { Resend } from 'resend';

// Load environment variables
dotenv.config();

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;
console.log('resend', resend);
export const emailService = {
  async sendAbandonedCartEmail(
    userEmail: string,
    items: any[],
    totalPrice: number,
    cartLink: string
  ): Promise<{ success: boolean; error?: string }> {
    // Return success without sending if Resend is not configured
    if (!resend) {
      console.log(`ℹ️ Email service not configured. Skipping email to ${userEmail}`);
      return { success: true };
    }

    try {
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const recoveryUrl = `${baseUrl}/recover/${cartLink}`;

      const itemsHtml = items
        .map(
          (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.productName}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">$${item.price.toFixed(2)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `
        )
        .join('');

      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .header h1 { margin: 0; font-size: 24px; }
              .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
              .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              .items-table th { background: #667eea; color: white; padding: 10px; text-align: left; }
              .total { font-size: 18px; font-weight: bold; color: #667eea; margin: 20px 0; }
              .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🛒 You Left Items in Your Cart!</h1>
              </div>
              <div class="content">
                <p>Hi there!</p>
                <p>We noticed you left some great items in your shopping cart. Here's what you were interested in:</p>
                
                <table class="items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>

                <div class="total">Total: $${totalPrice.toFixed(2)}</div>

                <p>Don't miss out on these items! Click the button below to return to your cart and complete your purchase:</p>

                <a href="${recoveryUrl}" class="cta-button">Recover My Cart</a>

                <p style="color: #666; font-size: 14px;">Or copy this link if the button doesn't work:<br>
                <code>${recoveryUrl}</code></p>

                <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                <p style="color: #666; font-size: 12px;">This is an automated reminder. Your cart will be saved for 30 days.</p>
              </div>
              <div class="footer">
                <p>&copy; CartReminder Service. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      const response = await resend!.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: userEmail,
        subject: '🛒 You left items in your cart! Complete your order now',
        html: htmlContent,
      });

      if (response.error) {
        console.error('Resend error:', response.error);
        return { success: false, error: response.error.message };
      }

      console.log(`✅ Email sent to ${userEmail}`);
      return { success: true };
    } catch (error) {
      console.error('Email service error:', error);
      return { success: false, error: String(error) };
    }
  },
};
