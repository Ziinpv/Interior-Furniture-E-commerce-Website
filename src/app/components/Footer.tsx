import React from 'react';
import { Link } from 'react-router';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-neutral-900 text-xl">M</span>
              </div>
              <span className="text-2xl">MBT</span>
            </div>
            <p className="text-neutral-400 text-sm mb-4">
              Nội thất cao cấp cho không gian sống hiện đại của bạn
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-neutral-700 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-neutral-700 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-neutral-700 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-neutral-700 transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg mb-4">Sản phẩm</h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Phòng khách
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Phòng ngủ
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Phòng ăn
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Phòng làm việc
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Phụ kiện
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg mb-4">Dịch vụ</h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link to="/room-planner" className="hover:text-white transition-colors">
                  Room Planner
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-white transition-colors">
                  Cộng đồng
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Tư vấn thiết kế
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Lắp đặt
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Bảo hành
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>123 Đường ABC, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <a href="tel:+84123456789" className="hover:text-white transition-colors">
                  +84 123 456 789
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <a href="mailto:info@mbt.com" className="hover:text-white transition-colors">
                  info@mbt.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-neutral-400">
              © 2026 MBT. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-neutral-400">
              <a href="#" className="hover:text-white transition-colors">
                Chính sách bảo mật
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Điều khoản sử dụng
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Chính sách đổi trả
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
