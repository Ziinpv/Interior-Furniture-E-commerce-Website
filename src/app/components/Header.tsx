import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Search, ShoppingCart, User, Menu, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Sản phẩm', path: '/products' },
    { name: 'Room Planner', path: '/room-planner' },
    { name: 'Cộng đồng', path: '/community' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">N</span>
            </div>
            <span className="text-2xl tracking-tight hidden sm:block">NoiThat</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-neutral-700 hover:text-neutral-900 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex items-center flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2 border border-neutral-300 rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors relative">
              <Heart className="h-6 w-6 text-neutral-700" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>
            <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors relative">
              <ShoppingCart className="h-6 w-6 text-neutral-700" />
              <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </button>
            <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
              <User className="h-6 w-6 text-neutral-700" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-neutral-200 bg-white"
          >
            <div className="px-4 py-4 space-y-3">
              <form onSubmit={handleSearch} className="lg:hidden mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-2 border border-neutral-300 rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                </div>
              </form>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 text-neutral-700 hover:text-neutral-900 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
