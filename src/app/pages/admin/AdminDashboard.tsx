import { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Users, Package, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { apiFetch } from '../../lib/api';
import { products as localProducts } from '../../data/products';

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  statusCount: Record<string, number>;
  revenueChart: Array<{ month: string; revenue: number }>;
  topProducts: Array<{ name: string; sold: number; revenue: number }>;
  recentOrders: Array<{
    id: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
}

const STATUS_COLORS: Record<string, string> = {
  processing: '#eab308',
  shipping: '#3b82f6',
  delivered: '#22c55e',
  cancelled: '#ef4444',
};

const STATUS_LABELS: Record<string, string> = {
  processing: 'Đang xử lý',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
};

function formatVND(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + '₫';
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fallbackStats: Stats = {
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: localProducts.length,
    statusCount: { processing: 0, shipping: 0, delivered: 0, cancelled: 0 },
    revenueChart: [],
    topProducts: [],
    recentOrders: [],
  };

  useEffect(() => {
    apiFetch<Stats>('/stats')
      .then(setStats)
      .catch(() => {
        setError('Không thể kết nối API /api/stats. Vui lòng chạy backend server.');
        setStats(fallbackStats);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-neutral-900 border-t-transparent rounded-full" />
      </div>
    );
  }

  const pieData = Object.entries(stats.statusCount)
    .filter(([, v]) => v > 0)
    .map(([key, value]) => ({ name: STATUS_LABELS[key] || key, value, color: STATUS_COLORS[key] || '#ccc' }));

  const statCards = [
    { label: 'Tổng doanh thu', value: formatVND(stats.totalRevenue), icon: DollarSign, color: 'bg-blue-500', bg: 'bg-blue-50' },
    { label: 'Đơn hàng', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-green-500', bg: 'bg-green-50' },
    { label: 'Khách hàng', value: stats.totalCustomers, icon: Users, color: 'bg-purple-500', bg: 'bg-purple-50' },
    { label: 'Sản phẩm', value: stats.totalProducts, icon: Package, color: 'bg-orange-500', bg: 'bg-orange-50' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Tổng quan</h1>
        <p className="text-neutral-500 mt-1">Xin chào! Đây là tình hình kinh doanh hôm nay.</p>
        {error && (
          <div className="mt-3 text-sm px-3 py-2 rounded-md border border-amber-200 bg-amber-50 text-amber-700">
            {error}
          </div>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.bg} rounded-lg flex items-center justify-center`}>
                <card.icon className={`h-6 w-6 text-${card.color.replace('bg-', '')}`} style={{ color: card.color.includes('blue') ? '#3b82f6' : card.color.includes('green') ? '#22c55e' : card.color.includes('purple') ? '#a855f7' : '#f97316' }} />
              </div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-sm text-neutral-500">{card.label}</p>
            <p className="text-2xl font-semibold mt-1">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <h2 className="text-lg font-semibold mb-4">Doanh thu theo tháng</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.revenueChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${(v / 1000000).toFixed(0)}M`} />
              <Tooltip formatter={(value: number) => formatVND(value)} labelStyle={{ fontWeight: 600 }} />
              <Bar dataKey="revenue" fill="#171717" radius={[6, 6, 0, 0]} name="Doanh thu" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Pie */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <h2 className="text-lg font-semibold mb-4">Trạng thái đơn hàng</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {pieData.map(item => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <h2 className="text-lg font-semibold mb-4">Đơn hàng gần đây</h2>
          <div className="space-y-3">
            {stats.recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                <div>
                  <p className="font-medium text-sm">{order.id}</p>
                  <p className="text-xs text-neutral-500">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">{formatVND(order.total)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'shipping' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <h2 className="text-lg font-semibold mb-4">Sản phẩm bán chạy</h2>
          <div className="space-y-3">
            {stats.topProducts.map((product, i) => (
              <div key={product.name} className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                <div className="w-8 h-8 bg-neutral-900 text-white rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  <p className="text-xs text-neutral-500">Đã bán: {product.sold}</p>
                </div>
                <p className="font-medium text-sm whitespace-nowrap">{formatVND(product.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
