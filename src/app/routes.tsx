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
