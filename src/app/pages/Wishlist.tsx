import { Link } from 'react-router';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { products } from '../data/products';
import { useShop } from '../context/ShopContext';

export function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useShop();
  const wishlistProducts = products.filter((product) => wishlist.includes(product.id));

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Heart className="h-16 w-16 mx-auto text-neutral-400 mb-4" />
          <h1 className="text-3xl mb-3">Chưa có sản phẩm yêu thích</h1>
          <p className="text-neutral-600 mb-6">
            Hãy bấm tim ở trang sản phẩm để lưu lại những món đồ bạn muốn mua sau.
          </p>
          <Link to="/products">
            <Button>Xem sản phẩm</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl mb-8">Sản phẩm yêu thích</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistProducts.map((product) => (
            <div key={product.id} className="border border-neutral-200 rounded-lg overflow-hidden">
              <Link to={`/products/${product.id}`} className="block aspect-square bg-neutral-100">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </Link>
              <div className="p-4">
                <Link to={`/products/${product.id}`} className="text-xl hover:text-neutral-600">
                  {product.name}
                </Link>
                <p className="text-sm text-neutral-500 mt-1">{product.category}</p>
                <p className="text-lg mt-3">{product.price.toLocaleString('vi-VN')}₫</p>
                <div className="flex gap-2 mt-4">
                  <Button
                    className="flex-1"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Thêm giỏ hàng
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => toggleWishlist(product.id)}
                    title="Xóa khỏi yêu thích"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
