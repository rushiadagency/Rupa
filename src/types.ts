export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number; // In Rupees (₹)
  rating: number;
  stock: number;
  imageUrl: string;
}

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  contactPhone: string;
  paymentMethod: 'Cash on Delivery';
  orderDate: string;
  status: OrderStatus;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  registeredDate: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}
