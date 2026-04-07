import { Link } from 'react-router';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { products } from '../data/products';
import { useShop } from '../context/ShopContext';

export function Cart() {
  const { cartItems, updateCartItemQuantity, removeFromCart, clearCart } = useShop();

  const detailedItems = cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return null;
      }
      return {
        ...item,
        product,
        lineTotal: product.price * item.quantity,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const subTotal = detailedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const shippingFee = subTotal > 0 ? 30000 : 0;
  const total = subTotal + shippingFee;

  if (detailedItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <ShoppingBag className="h-16 w-16 mx-auto text-neutral-400 mb-4" />
          <h1 className="text-3xl mb-3">Giỏ hàng đang trống</h1>
          <p className="text-neutral-600 mb-6">
            Hãy thêm một vài sản phẩm để bắt đầu đơn hàng của bạn.
          </p>
          <Link to="/products">
            <Button>Xem sản phẩm</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl">Giỏ hàng</h1>
          <Button variant="ghost" onClick={clearCart}>
            Xóa toàn bộ
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {detailedItems.map((item) => (
              <div key={`${item.productId}-${item.color}-${item.material}-${item.size}`} className="bg-white rounded-lg p-4 sm:p-6 border border-neutral-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full sm:w-32 h-32 object-cover rounded-md bg-neutral-100"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link to={`/products/${item.product.id}`} className="text-xl hover:text-neutral-600">
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-neutral-500 mt-1">{item.product.category}</p>
                        <p className="text-sm text-neutral-500 mt-2">
                          {item.color && `Màu: ${item.color}`}
                          {item.material && ` | Chất liệu: ${item.material}`}
                          {item.size && ` | Kích thước: ${item.size}`}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          removeFromCart(item.productId, {
                            color: item.color,
                            material: item.material,
                            size: item.size,
                          })
                        }
                        className="p-2 hover:bg-neutral-100 rounded-md"
                        title="Xóa sản phẩm"
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center border border-neutral-300 rounded-md">
                        <button
                          onClick={() =>
                            updateCartItemQuantity(
                              item.productId,
                              item.quantity - 1,
                              {
                                color: item.color,
                                material: item.material,
                                size: item.size,
                              }
                            )
                          }
                          className="p-2 hover:bg-neutral-100"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateCartItemQuantity(
                              item.productId,
                              item.quantity + 1,
                              {
                                color: item.color,
                                material: item.material,
                                size: item.size,
                              }
                            )
                          }
                          className="p-2 hover:bg-neutral-100"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-lg">
                        {item.lineTotal.toLocaleString('vi-VN')}
                        ₫
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="bg-white border border-neutral-200 rounded-lg p-6 h-fit">
            <h2 className="text-2xl mb-6">Tóm tắt đơn hàng</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-neutral-600">
                <span>Tạm tính</span>
                <span>{subTotal.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Phí vận chuyển</span>
                <span>{shippingFee.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="border-t border-neutral-200 pt-3 flex justify-between text-xl">
                <span>Tổng cộng</span>
                <span>{total.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>
            <Link to="/checkout" className="block">
              <Button className="w-full" size="lg">
                Tiến hành đặt hàng
              </Button>
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
