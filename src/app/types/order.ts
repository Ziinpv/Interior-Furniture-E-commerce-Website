export type PaymentMethod = 'cod' | 'vnpay';

export type OrderStatus = 'processing' | 'shipping' | 'delivered' | 'cancelled';

export interface OrderLine {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  color?: string;
  material?: string;
  size?: string;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'failed';
  customerName: string;
  phone: string;
  email: string;
  address: string;
  note?: string;
  items: OrderLine[];
  subtotal: number;
  shippingFee: number;
  total: number;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface PlaceOrderInput {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  note?: string;
  paymentMethod: PaymentMethod;
}
