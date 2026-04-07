import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Loader2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export function MockVnpayPayment() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || '';
  const navigate = useNavigate();
  const { orders, completeVnpayPayment } = useShop();
  const [message, setMessage] = useState('Đang kết nối tới cổng VNPay (mô phỏng)...');

  useEffect(() => {
    if (!orderId) {
      navigate('/cart', { replace: true });
      return;
    }

    const order = orders.find((o) => o.id === orderId);
    if (!order || order.paymentMethod !== 'vnpay') {
      navigate('/cart', { replace: true });
      return;
    }

    if (order.paymentStatus === 'paid') {
      return;
    }

    let cancelled = false;
    setMessage('Đang xử lý giao dịch...');
    const timer = window.setTimeout(() => {
      if (cancelled) {
        return;
      }
      completeVnpayPayment(orderId);
      setMessage('Thanh toán thành công. Đang chuyển hướng...');
      navigate(`/orders/${orderId}?thankYou=1`, { replace: true });
    }, 2200);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [orderId, navigate, orders, completeVnpayPayment]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-neutral-50">
      <div className="bg-white border border-neutral-200 rounded-xl p-10 max-w-md w-full text-center shadow-sm">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-neutral-900 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </div>
        <h1 className="text-2xl mb-2">VNPay (demo)</h1>
        <p className="text-neutral-600 text-sm mb-2">Mã đơn: {orderId || '—'}</p>
        <p className="text-neutral-600">{message}</p>
      </div>
    </div>
  );
}
