import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, CreditCard, Wallet } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { products } from '../data/products';
import { useShop } from '../context/ShopContext';
import type { PaymentMethod } from '../types/order';
import { apiFetch } from '../lib/api';

export function Checkout() {
  const navigate = useNavigate();
  const { cartItems, placeOrder } = useShop();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const summary = useMemo(() => {
    let subtotal = 0;
    for (const row of cartItems) {
      const product = products.find((p) => p.id === row.productId);
      if (product) {
        subtotal += product.price * row.quantity;
      }
    }
    const shippingFee = subtotal > 0 ? 30000 : 0;
    return { subtotal, shippingFee, total: subtotal + shippingFee };
  }, [cartItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim() || !phone.trim() || !email.trim() || !address.trim()) {
      setError('Vui lòng điền đầy đủ họ tên, số điện thoại, email và địa chỉ giao hàng.');
      return;
    }

    setSubmitting(true);
    const serverPayloadItems = cartItems
      .map((row) => {
        const product = products.find((p) => p.id === row.productId);
        if (!product) {
          return null;
        }
        return {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: row.quantity,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

    const order = placeOrder({
      customerName,
      phone,
      email,
      address,
      note,
      paymentMethod,
    });

    if (!order) {
      setError('Không thể tạo đơn hàng. Giỏ hàng có thể đang trống.');
      setSubmitting(false);
      return;
    }

    let serverOrderId: string | null = null;
    try {
      const serverOrder = await apiFetch<{ id: string }>('/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: serverPayloadItems,
          total: summary.total,
          paymentMethod: paymentMethod === 'vnpay' ? 'VNPay (demo)' : 'COD',
          shippingAddress: address,
          note,
          phone,
        }),
      });
      serverOrderId = serverOrder.id;
    } catch {
      // Keep local order flow for demo mode when API is unavailable.
    }

    if (paymentMethod === 'vnpay') {
      const query = new URLSearchParams({ orderId: order.id });
      if (serverOrderId) {
        query.set('serverOrderId', serverOrderId);
      }
      navigate(`/payment/vnpay?${query.toString()}`);
    } else {
      navigate(`/orders/${serverOrderId || order.id}?thankYou=1`);
    }
    setSubmitting(false);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl mb-4">Chưa có sản phẩm để thanh toán</h1>
        <Link to="/cart">
          <Button>Quay lại giỏ hàng</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại giỏ hàng
        </Link>

        <h1 className="text-4xl mb-2">Thanh toán</h1>
        <p className="text-neutral-600 mb-10">
          COD: thanh toán khi nhận hàng. VNPay: mô phỏng cổng thanh toán (demo học tập).
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-8">
            <section className="bg-white rounded-lg border border-neutral-200 p-6">
              <h2 className="text-xl mb-6">Thông tin giao hàng</h2>
              <div className="space-y-4">
                <Input
                  label="Họ và tên"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  autoComplete="name"
                />
                <Input
                  label="Số điện thoại"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  autoComplete="tel"
                />
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                <div>
                  <label className="block text-sm text-neutral-700 mb-2">Địa chỉ nhận hàng</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    required
                    className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    placeholder="Số nhà, đường, phường/xã, tỉnh/thành phố"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-700 mb-2">Ghi chú (tuỳ chọn)</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    placeholder="Giờ giao hàng, hướng dẫn vào hẻm..."
                  />
                </div>
              </div>
            </section>

            <section className="bg-white rounded-lg border border-neutral-200 p-6">
              <h2 className="text-xl mb-6">Phương thức thanh toán</h2>
              <div className="space-y-3">
                <label
                  className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    paymentMethod === 'cod' ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="pay"
                    className="mt-1"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <div>
                    <div className="flex items-center gap-2 font-medium">
                      <Wallet className="h-5 w-5" />
                      Thanh toán khi nhận hàng (COD)
                    </div>
                    <p className="text-sm text-neutral-600 mt-1">
                      Thanh toán tiền mặt cho shipper khi nhận đủ hàng.
                    </p>
                  </div>
                </label>
                <label
                  className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    paymentMethod === 'vnpay' ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="pay"
                    className="mt-1"
                    checked={paymentMethod === 'vnpay'}
                    onChange={() => setPaymentMethod('vnpay')}
                  />
                  <div>
                    <div className="flex items-center gap-2 font-medium">
                      <CreditCard className="h-5 w-5" />
                      VNPay (mô phỏng)
                    </div>
                    <p className="text-sm text-neutral-600 mt-1">
                      Sau khi đặt hàng, hệ thống mô phỏng xử lý thanh toán trong vài giây (không trừ tiền thật).
                    </p>
                  </div>
                </label>
              </div>
            </section>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-4 py-3">
                {error}
              </p>
            )}
          </div>

          <aside className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-neutral-200 p-6 sticky top-28">
              <h2 className="text-xl mb-6">Tóm tắt</h2>
              <div className="space-y-3 text-neutral-600 mb-6">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>{summary.subtotal.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>{summary.shippingFee.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="border-t border-neutral-200 pt-3 flex justify-between text-lg text-neutral-900">
                  <span>Tổng thanh toán</span>
                  <span>{summary.total.toLocaleString('vi-VN')}₫</span>
                </div>
              </div>
              <Button type="submit" className="w-full" size="lg" isLoading={submitting}>
                {paymentMethod === 'vnpay' ? 'Tiếp tục tới VNPay (demo)' : 'Đặt hàng'}
              </Button>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}
