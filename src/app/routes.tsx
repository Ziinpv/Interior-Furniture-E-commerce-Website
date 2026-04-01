import { createBrowserRouter } from 'react-router';
import { Root } from './Root';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { RoomPlanner } from './pages/RoomPlanner';
import { Community } from './pages/Community';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { Cart } from './pages/Cart';
import { Wishlist } from './pages/Wishlist';
import { Checkout } from './pages/Checkout';
import { MockVnpayPayment } from './pages/MockVnpayPayment';
import { OrderDetail } from './pages/OrderDetail';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/',
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: 'products',
        Component: Products,
      },
      {
        path: 'products/:id',
        Component: ProductDetail,
      },
      {
        path: 'room-planner',
        Component: RoomPlanner,
      },
      {
        path: 'community',
        Component: Community,
      },
      {
        path: 'dashboard',
        Component: Dashboard,
      },
      {
        path: 'cart',
        Component: Cart,
      },
      {
        path: 'wishlist',
        Component: Wishlist,
      },
      {
        path: 'checkout',
        Component: Checkout,
      },
      {
        path: 'payment/vnpay',
        Component: MockVnpayPayment,
      },
      {
        path: 'orders/:orderId',
        Component: OrderDetail,
      },
    ],
  },
  {
    path: '/admin',
    Component: AdminLayout,
    children: [
      {
        index: true,
        Component: AdminDashboard,
      },
      {
        path: 'products',
        Component: AdminProducts,
      },
      {
        path: 'orders',
        Component: AdminOrders,
      },
      {
        path: 'customers',
        Component: AdminCustomers,
      },
    ],
  },
]);
