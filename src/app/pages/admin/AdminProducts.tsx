import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, X, Loader2, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { apiFetch } from '../../lib/api';
import { FallbackImage } from '../../components/ui/FallbackImage';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  description: string;
  colors: Array<{ name: string; hex: string }>;
  materials: string[];
  sizes: Array<{ name: string; dimensions: string }>;
  rating: number;
  reviews: number;
  inStock: boolean;
  style: string;
}

const EMPTY_PRODUCT: Omit<Product, 'id' | 'rating' | 'reviews'> = {
  name: '', category: 'Phòng khách', price: 0, originalPrice: null,
  image: '', description: '', colors: [], materials: [], sizes: [], inStock: true, style: 'Modern',
};

const CATEGORIES = ['Phòng khách', 'Phòng ngủ', 'Phòng ăn', 'Phòng làm việc', 'Phòng tắm'];
const STYLES = ['Scandinavian', 'Modern', 'Minimalist', 'Indochine', 'Industrial', 'Contemporary'];

function formatVND(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + '₫';
}

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    apiFetch<Product[]>('/products')
      .then(setProducts)
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Không thể tải danh sách sản phẩm.');
        setProducts([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setEditing(null); setForm(EMPTY_PRODUCT); setShowModal(true); };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, category: p.category, price: p.price, originalPrice: p.originalPrice ?? null, image: p.image, description: p.description, colors: p.colors, materials: p.materials, sizes: p.sizes, inStock: p.inStock, style: p.style });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await apiFetch(`/products/${editing.id}`, { method: 'PUT', body: JSON.stringify(form) });
      } else {
        await apiFetch('/products', { method: 'POST', body: JSON.stringify(form) });
      }
      setShowModal(false);
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await apiFetch(`/products/${deleteId}`, { method: 'DELETE' });
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Sản phẩm</h1>
          <p className="text-neutral-500 mt-1">{products.length} sản phẩm</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm">
          <Plus className="h-4 w-4" /> Thêm sản phẩm
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm kiếm sản phẩm..."
          className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm"
        />
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
                  <th className="text-left px-6 py-4 font-medium text-neutral-600">Sản phẩm</th>
                  <th className="text-left px-6 py-4 font-medium text-neutral-600">Danh mục</th>
                  <th className="text-left px-6 py-4 font-medium text-neutral-600">Giá</th>
                  <th className="text-left px-6 py-4 font-medium text-neutral-600">Phong cách</th>
                  <th className="text-center px-6 py-4 font-medium text-neutral-600">Trạng thái</th>
                  <th className="text-right px-6 py-4 font-medium text-neutral-600">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map(product => (
                  <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FallbackImage
                          src={product.image}
                          fallbackSrc="https://picsum.photos/seed/mbt-admin-product/120/120"
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-neutral-100"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-neutral-500">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-600">{product.category}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{formatVND(product.price)}</p>
                      {product.originalPrice && (
                        <p className="text-xs text-neutral-400 line-through">{formatVND(product.originalPrice)}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-neutral-600">{product.style}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(product)} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors" title="Sửa">
                          <Pencil className="h-4 w-4 text-neutral-600" />
                        </button>
                        <button onClick={() => setDeleteId(product.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-neutral-500">Không tìm thấy sản phẩm</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-black/50 z-40" />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                  <h2 className="text-xl font-semibold">{editing ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-neutral-100 rounded-lg"><X className="h-5 w-5" /></button>
                </div>
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-1.5">Tên sản phẩm</label>
                      <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Danh mục</label>
                      <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Phong cách</label>
                      <select value={form.style} onChange={e => setForm({ ...form, style: e.target.value })} className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm">
                        {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Giá (VND)</label>
                      <input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Giá gốc (VND)</label>
                      <input type="number" value={form.originalPrice || ''} onChange={e => setForm({ ...form, originalPrice: e.target.value ? Number(e.target.value) : null })} placeholder="Để trống nếu không giảm giá" className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-1.5">URL hình ảnh</label>
                      <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-1.5">Mô tả</label>
                      <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-1.5">Chất liệu (mỗi dòng 1 chất liệu)</label>
                      <textarea value={form.materials.join('\n')} onChange={e => setForm({ ...form, materials: e.target.value.split('\n').filter(Boolean) })} rows={2} className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm" placeholder="Gỗ sồi&#10;Vải nhung" />
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-3">
                      <input type="checkbox" id="inStock" checked={form.inStock} onChange={e => setForm({ ...form, inStock: e.target.checked })} className="h-4 w-4" />
                      <label htmlFor="inStock" className="text-sm font-medium">Còn hàng</label>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200">
                  <button onClick={() => setShowModal(false)} className="px-5 py-2.5 border border-neutral-300 rounded-lg hover:bg-neutral-50 text-sm">Hủy</button>
                  <button onClick={handleSave} disabled={saving || !form.name || !form.price} className="px-5 py-2.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:opacity-50 text-sm inline-flex items-center gap-2">
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                    {editing ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteId(null)} className="fixed inset-0 bg-black/50 z-40" />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
                <h3 className="text-lg font-semibold mb-2">Xác nhận xóa</h3>
                <p className="text-neutral-600 text-sm mb-6">Bạn có chắc muốn xóa sản phẩm này? Hành động này không thể hoàn tác.</p>
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setDeleteId(null)} className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 text-sm">Hủy</button>
                  <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">Xóa</button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
