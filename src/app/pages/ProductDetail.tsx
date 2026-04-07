import React, { useState } from 'react';
import { useParams, Link } from 'react-router';
import { ShoppingCart, Heart, Share2, Star, Check, Truck, Shield, ArrowLeft } from 'lucide-react';
import { products } from '../data/products';
import { Button } from '../components/ui/Button';
import { motion } from 'motion/react';
import { useShop } from '../context/ShopContext';
import { FallbackImage } from '../components/ui/FallbackImage';

export function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addToCart, isInWishlist, toggleWishlist } = useShop();

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const isFavorite = product ? isInWishlist(product.id) : false;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl mb-4">Không tìm thấy sản phẩm</h1>
          <Link to="/products">
            <Button>Quay lại danh sách sản phẩm</Button>
          </Link>
        </div>
      </div>
    );
  }

  const reviews = [
    {
      id: 1,
      name: 'Nguyễn Thị Mai',
      rating: 5,
      comment: 'Sản phẩm rất đẹp và chất lượng. Giao hàng nhanh, đóng gói cẩn thận.',
      date: '15/02/2026',
    },
    {
      id: 2,
      name: 'Trần Văn Nam',
      rating: 4,
      comment: 'Thiết kế đẹp, phù hợp với không gian hiện đại. Giá hơi cao nhưng chất lượng xứng đáng.',
      date: '10/02/2026',
    },
    {
      id: 3,
      name: 'Lê Thị Hương',
      rating: 5,
      comment: 'Rất hài lòng với sản phẩm. Màu sắc đúng như hình. Nhân viên tư vấn nhiệt tình.',
      date: '05/02/2026',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-neutral-600 mb-8">
          <Link to="/" className="hover:text-neutral-900">Trang chủ</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-neutral-900">Sản phẩm</Link>
          <span>/</span>
          <span className="text-neutral-900">{product.name}</span>
        </div>

        <Link to="/products" className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách sản phẩm
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div>
            <motion.div
              key={selectedColor}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square bg-neutral-100 rounded-lg overflow-hidden mb-4"
            >
              <FallbackImage
                src={product.colors[selectedColor].image || product.image}
                fallbackSrc="https://picsum.photos/seed/mbt-product-detail-fallback/1200/900"
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-neutral-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <FallbackImage
                    src={product.image}
                    fallbackSrc="https://picsum.photos/seed/mbt-product-thumb-fallback/600/600"
                    alt={`${product.name} ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-neutral-500 uppercase tracking-wide mb-2">
                  {product.category}
                </p>
                <h1 className="text-4xl mb-4">{product.name}</h1>
              </div>
              <button
                onClick={() => toggleWishlist(product.id)}
                className="p-3 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <Heart
                  className={`h-6 w-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-neutral-600'}`}
                />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-neutral-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-neutral-600">
                {product.rating} ({product.reviews} đánh giá)
              </span>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl text-neutral-900">
                  {product.price.toLocaleString('vi-VN')}₫
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-neutral-400 line-through">
                      {product.originalPrice.toLocaleString('vi-VN')}₫
                    </span>
                    <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm">
                      Giảm{' '}
                      {Math.round(
                        ((product.originalPrice - product.price) / product.originalPrice) * 100
                      )}
                      %
                    </span>
                  </>
                )}
              </div>
            </div>

            <p className="text-neutral-700 mb-8 leading-relaxed">{product.description}</p>
            <div className="mb-8 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-sm bg-neutral-100 text-neutral-700"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Customizer */}
            <div className="space-y-6 mb-8">
              {/* Colors */}
              <div>
                <label className="block text-sm mb-3">
                  Màu sắc: <span className="text-neutral-900">{product.colors[selectedColor].name}</span>
                </label>
                <div className="flex gap-3">
                  {product.colors.map((color, index) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(index)}
                      className={`w-12 h-12 rounded-full border-2 transition-all ${
                        selectedColor === index
                          ? 'border-neutral-900 scale-110'
                          : 'border-neutral-300 hover:border-neutral-400'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor === index && (
                        <Check className="h-6 w-6 text-white mx-auto drop-shadow-md" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Materials */}
              <div>
                <label className="block text-sm mb-3">
                  Chất liệu: <span className="text-neutral-900">{product.materials[selectedMaterial]}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.materials.map((material, index) => (
                    <button
                      key={material}
                      onClick={() => setSelectedMaterial(index)}
                      className={`px-4 py-2 rounded-md border-2 transition-all ${
                        selectedMaterial === index
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-300 hover:border-neutral-400'
                      }`}
                    >
                      {material}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm mb-3">
                  Kích thước: <span className="text-neutral-900">{product.sizes[selectedSize].dimensions}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size, index) => (
                    <button
                      key={size.name}
                      onClick={() => setSelectedSize(index)}
                      className={`px-4 py-2 rounded-md border-2 transition-all ${
                        selectedSize === index
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-300 hover:border-neutral-400'
                      }`}
                    >
                      <div>{size.name}</div>
                      <div className="text-xs opacity-75">{size.dimensions}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm mb-3">Số lượng</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-neutral-300 rounded-md">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-neutral-100 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-6 py-2 border-x-2 border-neutral-300">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-neutral-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-neutral-600">
                    {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <Button
                size="lg"
                className="flex-1"
                onClick={() =>
                  addToCart(
                    product,
                    {
                      color: product.colors[selectedColor].name,
                      material: product.materials[selectedMaterial],
                      size: product.sizes[selectedSize].name,
                    },
                    quantity
                  )
                }
              >
                <ShoppingCart className="h-5 w-5" />
                Thêm vào giỏ hàng
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.navigator.clipboard?.writeText(window.location.href)}
                title="Sao chép link sản phẩm"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <Button variant="outline" size="lg" className="w-full mb-8">
              Yêu cầu kích thước riêng
            </Button>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-neutral-50 rounded-lg">
              <div className="text-center">
                <Truck className="h-8 w-8 mx-auto mb-2 text-neutral-700" />
                <p className="text-sm">Miễn phí vận chuyển</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 mx-auto mb-2 text-neutral-700" />
                <p className="text-sm">Bảo hành 2 năm</p>
              </div>
              <div className="text-center">
                <Check className="h-8 w-8 mx-auto mb-2 text-neutral-700" />
                <p className="text-sm">Đổi trả trong 30 ngày</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="border-t border-neutral-200 pt-16">
          <h2 className="text-3xl mb-8">Đánh giá từ khách hàng</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-neutral-50 p-8 rounded-lg text-center">
              <div className="text-5xl mb-2">{product.rating}</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-neutral-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-neutral-600">{product.reviews} đánh giá</p>
            </div>

            <div className="md:col-span-2 space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-neutral-200 pb-6 last:border-0">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">{review.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-neutral-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-neutral-500">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-neutral-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
