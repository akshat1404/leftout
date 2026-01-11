import mongoose, { Schema, Document } from 'mongoose';
import { randomUUID } from 'crypto';

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: CartItem[];
  totalPrice: number;
  status: 'active' | 'abandoned' | 'completed';
  createdAt: Date;
  lastUpdated: Date;
  notificationSent: boolean;
  notificationSentAt?: Date;
  cartLink: string;
}

const cartItemSchema = new Schema<CartItem>(
  {
    productId: String,
    productName: String,
    price: Number,
    quantity: Number,
    image: String,
  },
  { _id: false }
);

const cartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'abandoned', 'completed'],
      default: 'active',
    },
    lastUpdated: {
      type: Date,
      default: () => new Date(),
    },
    notificationSent: {
      type: Boolean,
      default: false,
    },
    notificationSentAt: {
      type: Date,
      optional: true,
    },
    cartLink: {
      type: String,
      unique: true,
      default: () => randomUUID(),
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups
cartSchema.index({ userId: 1, createdAt: -1 });
cartSchema.index({ status: 1, createdAt: -1 });
cartSchema.index({ cartLink: 1 });

export const Cart = mongoose.model<ICart>('Cart', cartSchema);
