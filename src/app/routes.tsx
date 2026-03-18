import { createBrowserRouter } from 'react-router';
import { Root } from './Root';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { RoomPlanner } from './pages/RoomPlanner';
import { Community } from './pages/Community';
import { Dashboard } from './pages/Dashboard';

export const router = createBrowserRouter([
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
]);
