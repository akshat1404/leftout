import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  cartId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  email: string;
  status: 'sent' | 'failed';
  sentAt: Date;
  response?: string;
}

const notificationSchema = new Schema<INotification>(
  {
    cartId: {
      type: Schema.Types.ObjectId,
      ref: 'Cart',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['sent', 'failed'],
      default: 'sent',
    },
    response: {
      type: String,
      optional: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ cartId: 1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
