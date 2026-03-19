import { useState, useEffect } from 'react';
import { Search, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { apiFetch } from '../../lib/api';

interface Customer {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  address: string;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
}

function formatVND(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + '₫';
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function AdminCustomers() {
  const [users, setUsers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    apiFetch<Customer[]>('/users')
      .then(data => setUsers(data.filter(u => u.role === 'customer')))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Khách hàng</h1>
        <p className="text-neutral-500 mt-1">{users.length} khách hàng</p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm kiếm khách hàng..."
          className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-neutral-900 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((customer, i) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center text-white text-lg font-medium flex-shrink-0">
                  {customer.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold truncate">{customer.name}</h3>
                  <p className="text-xs text-neutral-500">Tham gia: {formatDate(customer.createdAt)}</p>
                </div>
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-2 text-neutral-600">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{customer.phone || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{customer.address || 'Chưa cập nhật'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-5 pt-4 border-t border-neutral-100">
                <div className="flex items-center gap-1.5 text-sm">
                  <ShoppingBag className="h-4 w-4 text-neutral-400" />
                  <span className="font-medium">{customer.totalOrders}</span>
                  <span className="text-neutral-500">đơn hàng</span>
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-neutral-900">{formatVND(customer.totalSpent)}</span>
                </div>
              </div>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-neutral-500">Không tìm thấy khách hàng</div>
          )}
        </div>
      )}
    </div>
  );
}
