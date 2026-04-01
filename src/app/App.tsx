import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { ShopProvider } from './context/ShopContext';

export default function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <RouterProvider router={router} />
      </ShopProvider>
    </AuthProvider>
  );
}
