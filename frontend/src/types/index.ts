export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
}

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  status: 'active' | 'abandoned' | 'completed';
  createdAt: string;
  lastUpdated: string;
  notificationSent: boolean;
  cartLink: string;
}

export interface User {
  _id: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
