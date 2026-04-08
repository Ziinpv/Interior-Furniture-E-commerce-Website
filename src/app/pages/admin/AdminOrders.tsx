import { useState, useEffect } from 'react';
import { Eye, X, Loader2, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { apiFetch } from '../../lib/api';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: 'processing' | 'shipping' | 'delivered' | 'cancelled';
  paymentMethod: string;
  shippingAddress: string;
  trackingNumber?: string;
  createdAt: string;
  estimatedDelivery?: string;
}

const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'processing', label: 'Đang xử lý' },
  { value: 'shipping', label: 'Đang giao' },
  { value: 'delivered', label: 'Đã giao' },
  { value: 'cancelled', label: 'Đã hủy' },
];

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  processing: { label: 'Đang xử lý', cls: 'bg-yellow-100 text-yellow-700' },
  shipping: { label: 'Đang giao', cls: 'bg-blue-100 text-blue-700' },
  delivered: { label: 'Đã giao', cls: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Đã hủy', cls: 'bg-red-100 text-red-700' },
};

function formatVND(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + '₫';
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    const url = statusFilter ? `/orders?status=${statusFilter}` : '/orders';
    apiFetch<Order[]>(url)
      .then(setOrders)
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Không thể tải danh sách đơn hàng.');
        setOrders([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [statusFilter]);

  const updateStatus = async () => {
    if (!selected || !newStatus) return;
    setUpdating(true);
    try {
      const updated = await apiFetch<Order>(`/orders/${selected.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      setSelected(updated);
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Đơn hàng</h1>
        <p className="text-neutral-500 mt-1">{orders.length} đơn hàng</p>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors border ${
              statusFilter === opt.value
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {error && (
        <div className="mb-6 flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <span>{error}</span>
          <button
            onClick={load}
            className="inline-flex items-center gap-1 rounded-md bg-white px-3 py-1.5 text-amber-800 border border-amber-200 hover:bg-amber-100"
          >
            <RefreshCcw className="h-4 w-4" />
            Tải lại
          </button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-neutral-900 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left px-6 py-4 font-medium text-neutral-600">Mã đơn</th>
                  <th className="text-left px-6 py-4 font-medium text-neutral-600">Khách hàng</th>
                  <th className="text-left px-6 py-4 font-medium text-neutral-600">Sản phẩm</th>
                  <th className="text-left px-6 py-4 font-medium text-neutral-600">Tổng tiền</th>
                  <th className="text-center px-6 py-4 font-medium text-neutral-600">Trạng thái</th>
                  <th className="text-left px-6 py-4 font-medium text-neutral-600">Ngày đặt</th>
                  <th className="text-right px-6 py-4 font-medium text-neutral-600">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {orders.map(order => {
                  const st = STATUS_MAP[order.status] || { label: order.status, cls: 'bg-neutral-100 text-neutral-700' };
                  return (
                    <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4 font-medium">{order.id}</td>
                      <td className="px-6 py-4">
                        <p>{order.customerName}</p>
                        <p className="text-xs text-neutral-500">{order.customerEmail}</p>
                      </td>
                      <td className="px-6 py-4 text-neutral-600 max-w-[200px] truncate">
                        {order.items.map(i => i.name).join(', ')}
                      </td>
                      <td className="px-6 py-4 font-medium">{formatVND(order.total)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${st.cls}`}>{st.label}</span>
                      </td>
                      <td className="px-6 py-4 text-neutral-600">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => { setSelected(order); setNewStatus(order.status); }} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors" title="Chi tiết">
                          <Eye className="h-4 w-4 text-neutral-600" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {orders.length === 0 && (
                  <tr><td colSpan={7} className="px-6 py-12 text-center text-neutral-500">Không có đơn hàng</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="fixed inset-0 bg-black/50 z-40" />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                  <h2 className="text-xl font-semibold">Đơn hàng {selected.id}</h2>
                  <button onClick={() => setSelected(null)} className="p-2 hover:bg-neutral-100 rounded-lg"><X className="h-5 w-5" /></button>
                </div>
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-neutral-500">Khách hàng</p>
                      <p className="font-medium">{selected.customerName}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500">Email</p>
                      <p className="font-medium">{selected.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500">Ngày đặt</p>
                      <p className="font-medium">{formatDate(selected.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500">Thanh toán</p>
                      <p className="font-medium">{selected.paymentMethod}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-neutral-500">Địa chỉ giao hàng</p>
                      <p className="font-medium">{selected.shippingAddress}</p>
                    </div>
                    {selected.trackingNumber && (
                      <div className="col-span-2">
                        <p className="text-neutral-500">Mã vận đơn</p>
                        <p className="font-medium font-mono">{selected.trackingNumber}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-neutral-500 mb-2">Sản phẩm</p>
                    <div className="space-y-2">
                      {selected.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm p-3 bg-neutral-50 rounded-lg">
                          <span>{item.name} x{item.quantity}</span>
                          <span className="font-medium">{formatVND(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-3 pt-3 border-t border-neutral-200 font-semibold">
                      <span>Tổng cộng</span>
                      <span>{formatVND(selected.total)}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Cập nhật trạng thái</label>
                    <div className="flex gap-3">
                      <select
                        value={newStatus}
                        onChange={e => setNewStatus(e.target.value)}
                        className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm"
                      >
                        <option value="processing">Đang xử lý</option>
                        <option value="shipping">Đang giao hàng</option>
                        <option value="delivered">Đã giao</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                      <button
                        onClick={updateStatus}
                        disabled={updating || newStatus === selected.status}
                        className="px-5 py-2.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:opacity-50 text-sm inline-flex items-center gap-2"
                      >
                        {updating && <Loader2 className="h-4 w-4 animate-spin" />}
                        Cập nhật
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
