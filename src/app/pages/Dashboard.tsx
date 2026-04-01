import React, { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Package, Truck, CheckCircle, Clock, Calendar, Settings, User, MapPin, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useShop } from '../context/ShopContext';
import type { OrderStatus } from '../types/order';

function formatOrderDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

const warranties = [
  {
    id: 'WAR-001',
    product: 'Sofa Scandinavian Premium',
    purchaseDate: '15/12/2025',
    expiryDate: '15/12/2027',
    status: 'active',
  },
  {
    id: 'WAR-002',
    product: 'Bàn ăn gỗ Modern',
    purchaseDate: '20/11/2025',
    expiryDate: '20/11/2027',
    status: 'active',
  },
];

export function Dashboard() {
  const [showWarrantyModal, setShowWarrantyModal] = useState(false);
  const { orders } = useShop();

  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [orders]
  );

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipping':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'processing':
        return 'Đang xử lý';
      case 'shipping':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã giao';
      case 'cancelled':
        return 'Đã hủy';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-5 w-5" />;
      case 'shipping':
        return <Truck className="h-5 w-5" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5" />;
      case 'cancelled':
        return <Package className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl mb-4">Dashboard</h1>
          <p className="text-neutral-600">
            Quản lý đơn hàng, theo dõi giao hàng và bảo hành
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-200">
                <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center text-white text-2xl">
                  NT
                </div>
                <div>
                  <h3 className="text-lg">Nguyễn Thị Mai</h3>
                  <p className="text-sm text-neutral-600">nguyenmai@email.com</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-neutral-900 text-white rounded-md">
                  <Package className="h-5 w-5" />
                  Đơn hàng
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-100 rounded-md transition-colors">
                  <User className="h-5 w-5" />
                  Tài khoản
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-100 rounded-md transition-colors">
                  <MapPin className="h-5 w-5" />
                  Địa chỉ
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-100 rounded-md transition-colors">
                  <CreditCard className="h-5 w-5" />
                  Thanh toán
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-100 rounded-md transition-colors">
                  <Settings className="h-5 w-5" />
                  Cài đặt
                </button>
              </nav>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg mb-4">Thống kê</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Tổng đơn hàng</span>
                  <span className="text-lg">{sortedOrders.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Đang giao</span>
                  <span className="text-lg text-blue-600">
                    {sortedOrders.filter((o) => o.status === 'shipping').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Đã giao</span>
                  <span className="text-lg text-green-600">
                    {sortedOrders.filter((o) => o.status === 'delivered').length}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Orders Section */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">Đơn hàng của tôi</h2>
                <select className="px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900">
                  <option>Tất cả đơn hàng</option>
                  <option>Đang xử lý</option>
                  <option>Đang giao hàng</option>
                  <option>Đã giao</option>
                </select>
              </div>

              <div className="space-y-4">
                {sortedOrders.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-neutral-200 rounded-lg">
                    <p className="text-neutral-600 mb-4">Bạn chưa có đơn hàng nào.</p>
                    <Link to="/products">
                      <Button>Đi mua sắm</Button>
                    </Link>
                  </div>
                ) : (
                  sortedOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg">Đơn hàng {order.id}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600">
                          Đặt lúc: {formatOrderDate(order.createdAt)}
                        </p>
                        {order.estimatedDelivery && (
                          <p className="text-sm text-neutral-600">
                            Dự kiến giao: {order.estimatedDelivery}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl">{order.total.toLocaleString('vi-VN')}₫</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-neutral-600 mb-2">Sản phẩm:</p>
                      <ul className="space-y-1">
                        {order.items.map((line) => (
                          <li key={`${line.productId}-${line.name}-${line.size}`} className="text-sm">
                            • {line.name} × {line.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {order.trackingNumber && (
                      <div className="bg-neutral-50 p-4 rounded-md mb-4">
                        <p className="text-sm text-neutral-600 mb-1">Mã vận đơn:</p>
                        <p className="text-sm font-mono">{order.trackingNumber}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      <Link to={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          Chi tiết
                        </Button>
                      </Link>
                      {order.status === 'shipping' && (
                        <Link to={`/orders/${order.id}`}>
                          <Button variant="outline" size="sm">
                            <Truck className="h-4 w-4" />
                            Theo dõi
                          </Button>
                        </Link>
                      )}
                      {order.status === 'delivered' && (
                        <Link to="/products">
                          <Button variant="outline" size="sm">
                            Mua lại
                          </Button>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Warranty Section */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">Quản lý bảo hành</h2>
                <Button variant="outline" onClick={() => setShowWarrantyModal(true)}>
                  Gửi yêu cầu bảo hành
                </Button>
              </div>

              <div className="space-y-4">
                {warranties.map((warranty, index) => (
                  <motion.div
                    key={warranty.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-neutral-200 rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg mb-2">{warranty.product}</h3>
                        <div className="space-y-1 text-sm text-neutral-600">
                          <p className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Ngày mua: {warranty.purchaseDate}
                          </p>
                          <p className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Hết hạn: {warranty.expiryDate}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        Còn hiệu lực
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Installation Schedule */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-2xl mb-6">Lịch lắp đặt</h2>
              <div className="border border-neutral-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg mb-2">Lắp đặt Sofa Scandinavian</h3>
                    <p className="text-sm text-neutral-600 mb-1">
                      Ngày: 16/03/2026 - 14:00 - 16:00
                    </p>
                    <p className="text-sm text-neutral-600 mb-4">
                      Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Đổi lịch
                      </Button>
                      <Button variant="outline" size="sm">
                        Hủy lịch
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warranty Request Modal */}
      <Modal
        isOpen={showWarrantyModal}
        onClose={() => setShowWarrantyModal(false)}
        title="Gửi yêu cầu bảo hành"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Sản phẩm</label>
            <select className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900">
              <option>Chọn sản phẩm...</option>
              {warranties.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.product}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">Vấn đề gặp phải</label>
            <textarea
              rows={4}
              placeholder="Mô tả chi tiết vấn đề..."
              className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Hình ảnh (tùy chọn)</label>
            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-neutral-900 transition-colors cursor-pointer">
              <p className="text-sm text-neutral-600">Click để tải ảnh lên</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowWarrantyModal(false)} className="flex-1">
              Hủy
            </Button>
            <Button className="flex-1">Gửi yêu cầu</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
