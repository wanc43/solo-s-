export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock_quantity: number;
  image: string;
  images?: string[];
  category: string;
  brand: string;
  featured: boolean;
  rating: number;
  reviews?: number;
  specs?: Record<string, any>;
  createdAt: any;
  updatedAt: any;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
  brand: string;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  shippingDetails: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
  };
  createdAt: any;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}
