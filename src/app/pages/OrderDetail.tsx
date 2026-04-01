import React from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { ArrowLeft, CheckCircle2, Circle, Package, Truck, CreditCard, Wallet } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useShop } from '../context/ShopContext';
import type { OrderStatus } from '../types/order';

function formatDate(iso: string) {
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

function statusLabel(s: OrderStatus) {
  switch (s) {
    case 'processing':
      return 'Đang xử lý';
    case 'shipping':
      return 'Đang giao hàng';
    case 'delivered':
      return 'Đã giao';
    case 'cancelled':
      return 'Đã hủy';
    default:
      return s;
  }
}

const timelineLabels = ['Đã đặt hàng', 'Đang chuẩn bị', 'Đang giao hàng', 'Hoàn thành'];

function completedTimelineSteps(status: OrderStatus): number {
  switch (status) {
    case 'processing':
      return 2;
    case 'shipping':
      return 3;
    case 'delivered':
      return 4;
    case 'cancelled':
      return 0;
    default:
      return 1;
  }
}

export function OrderDetail() {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const thankYou = searchParams.get('thankYou') === '1';
  const { getOrder } = useShop();
  const order = orderId ? getOrder(orderId) : undefined;

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl mb-4">Không tìm thấy đơn hàng</h1>
        <Link to="/products">
          <Button>Tiếp tục mua sắm</Button>
        </Link>
      </div>
    );
  }

  const doneCount = completedTimelineSteps(order.status);
  const showTimeline = order.status !== 'cancelled';

  return (
    <div className="min-h-screen bg-neutral-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Về Dashboard
        </Link>

        {thankYou && (
          <div className="mb-8 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-900 text-sm">
            Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xác nhận trong thời gian sớm nhất.
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl mb-1">Đơn hàng {order.id}</h1>
            <p className="text-neutral-600 text-sm">Đặt lúc {formatDate(order.createdAt)}</p>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
              order.status === 'delivered'
                ? 'bg-green-100 text-green-800'
                : order.status === 'shipping'
                  ? 'bg-blue-100 text-blue-800'
                  : order.status === 'cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {statusLabel(order.status)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white border border-neutral-200 rounded-lg p-5">
            <p className="text-sm text-neutral-500 mb-1">Thanh toán</p>
            <div className="flex items-center gap-2 font-medium">
              {order.paymentMethod === 'vnpay' ? (
                <CreditCard className="h-4 w-4" />
              ) : (
                <Wallet className="h-4 w-4" />
              )}
              {order.paymentMethod === 'vnpay' ? 'VNPay (demo)' : 'COD'}
            </div>
            <p className="text-sm text-neutral-600 mt-2">
              Trạng thái:{' '}
              {order.paymentMethod === 'vnpay'
                ? order.paymentStatus === 'paid'
                  ? 'Đã thanh toán (mô phỏng)'
                  : 'Chưa thanh toán'
                : 'Thanh toán khi nhận hàng'}
            </p>
          </div>
          <div className="bg-white border border-neutral-200 rounded-lg p-5 md:col-span-2">
            <p className="text-sm text-neutral-500 mb-1">Giao tới</p>
            <p className="font-medium">{order.customerName}</p>
            <p className="text-sm text-neutral-700 mt-1">{order.phone}</p>
            <p className="text-sm text-neutral-700">{order.email}</p>
            <p className="text-sm text-neutral-600 mt-2">{order.address}</p>
            {order.note && <p className="text-sm text-neutral-500 mt-2">Ghi chú: {order.note}</p>}
          </div>
        </div>

        {showTimeline && (
          <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-10">
            <h2 className="text-lg font-medium mb-6">Tiến trình đơn hàng</h2>
            <div className="space-y-0">
              {timelineLabels.map((label, i) => {
                const active = i < doneCount;
                const isLast = i === timelineLabels.length - 1;
                return (
                  <div key={label} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`rounded-full p-1 ${
                          active ? 'text-neutral-900' : 'text-neutral-300'
                        }`}
                      >
                        {active ? (
                          <CheckCircle2 className="h-6 w-6" />
                        ) : (
                          <Circle className="h-6 w-6" />
                        )}
                      </div>
                      {!isLast && (
                        <div
                          className={`w-0.5 flex-1 min-h-[24px] ${
                            i < doneCount - 1 ? 'bg-neutral-900' : 'bg-neutral-200'
                          }`}
                        />
                      )}
                    </div>
                    <div className={`pb-8 ${isLast ? 'pb-0' : ''}`}>
                      <p className={active ? 'font-medium' : 'text-neutral-400'}>{label}</p>
                      {i === 0 && active && (
                        <p className="text-xs text-neutral-500 mt-1">Đơn đã được ghi nhận</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {order.status === 'cancelled' && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-10 text-red-900 text-sm">
            Đơn hàng này đã bị hủy.
          </div>
        )}

        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden mb-10">
          <div className="px-6 py-4 border-b border-neutral-200 flex items-center gap-2">
            <Package className="h-5 w-5" />
            <h2 className="text-lg">Sản phẩm</h2>
          </div>
          <ul className="divide-y divide-neutral-100">
            {order.items.map((line) => (
              <li key={`${line.productId}-${line.color}-${line.size}`} className="px-6 py-4 flex gap-4">
                <img
                  src={line.image}
                  alt=""
                  className="w-20 h-20 object-cover rounded-md bg-neutral-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{line.name}</p>
                  <p className="text-sm text-neutral-500">
                    SL: {line.quantity}
                    {line.color && ` · ${line.color}`}
                    {line.material && ` · ${line.material}`}
                    {line.size && ` · ${line.size}`}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p>{line.lineTotal.toLocaleString('vi-VN')}₫</p>
                  <p className="text-xs text-neutral-500">
                    {line.unitPrice.toLocaleString('vi-VN')}₫ / SP
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="px-6 py-4 bg-neutral-50 space-y-2 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>Tạm tính</span>
              <span>{order.subtotal.toLocaleString('vi-VN')}₫</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Phí vận chuyển</span>
              <span>{order.shippingFee.toLocaleString('vi-VN')}₫</span>
            </div>
            <div className="flex justify-between text-lg text-neutral-900 pt-2 border-t border-neutral-200">
              <span>Tổng cộng</span>
              <span>{order.total.toLocaleString('vi-VN')}₫</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/products">
            <Button variant="outline">Tiếp tục mua sắm</Button>
          </Link>
          {order.status === 'shipping' && order.trackingNumber && (
            <Button variant="outline">
              <Truck className="h-4 w-4" />
              Mã vận đơn: {order.trackingNumber}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
