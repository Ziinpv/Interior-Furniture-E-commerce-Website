import { useState } from 'react';
import { NavLink, Navigate, Outlet } from 'react-router';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Menu, X, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Tổng quan', end: true },
  { to: '/admin/products', icon: Package, label: 'Sản phẩm', end: false },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Đơn hàng', end: false },
  { to: '/admin/customers', icon: Users, label: 'Khách hàng', end: false },
];

export function AdminLayout() {
  const { user, isAdmin, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-spin h-8 w-8 border-4 border-neutral-900 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-neutral-900 text-white flex-shrink-0">
        <div className="p-6 border-b border-neutral-800">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
              <span className="text-neutral-900 text-lg font-bold">M</span>
            </div>
            <div>
              <span className="text-lg tracking-tight">MBT</span>
              <span className="block text-xs text-neutral-400">Admin Panel</span>
            </div>
          </NavLink>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm ${
                  isActive ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <div className="flex items-center gap-3 px-4 py-2 mb-3">
            <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{user.name}</p>
              <p className="text-xs text-neutral-400 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-neutral-400 hover:text-red-400 hover:bg-white/5 transition-colors text-sm"
          >
            <LogOut className="h-5 w-5" />
            Đăng xuất
          </button>
          <NavLink
            to="/"
            className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors text-sm mt-1"
          >
            <ChevronLeft className="h-5 w-5" />
            Về trang chủ
          </NavLink>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-30 bg-neutral-900 text-white h-16 flex items-center px-4">
        <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-neutral-800 rounded-lg">
          <Menu className="h-6 w-6" />
        </button>
        <span className="ml-3 text-lg">Admin Panel</span>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-neutral-900 text-white z-50 flex flex-col"
            >
              <div className="p-4 flex items-center justify-between border-b border-neutral-800">
                <span className="text-lg">MBT Admin</span>
                <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-neutral-800 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                {navItems.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm ${
                        isActive ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <div className="p-4 border-t border-neutral-800">
                <button
                  onClick={() => { logout(); setSidebarOpen(false); }}
                  className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-neutral-400 hover:text-red-400 text-sm"
                >
                  <LogOut className="h-5 w-5" />
                  Đăng xuất
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-auto lg:pt-0 pt-16">
        <Outlet />
      </main>
    </div>
  );
}
