import React, { useState } from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'react-router';
import { ProductCard } from '../components/ui/ProductCard';
import { products, categories } from '../data/products';
import { Button } from '../components/ui/Button';

export function Products() {
  const [searchParams] = useSearchParams();
  const searchQuery = (searchParams.get('search') || '').toLowerCase().trim();
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('Mới nhất');

  const filteredProducts = products.filter((product) => {
    if (selectedCategory !== 'Tất cả' && product.category !== selectedCategory) {
      return false;
    }
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    if (
      searchQuery &&
      !`${product.name} ${product.description} ${product.category}`
        .toLowerCase()
        .includes(searchQuery)
    ) {
      return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'Giá thấp đến cao') {
      return a.price - b.price;
    }
    if (sortBy === 'Giá cao đến thấp') {
      return b.price - a.price;
    }
    if (sortBy === 'Phổ biến nhất') {
      return b.reviews - a.reviews;
    }
    return Number(b.id) - Number(a.id);
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl mb-4">Sản Phẩm</h1>
          <p className="text-neutral-600">
            Khám phá bộ sưu tập nội thất cao cấp của chúng tôi
          </p>
          {searchQuery && (
            <p className="text-sm text-neutral-500 mt-2">
              Kết quả cho: "{searchQuery}"
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="h-5 w-5" />
                <h2 className="text-xl">Bộ lọc</h2>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-sm mb-3 text-neutral-700">Danh mục</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedCategory === category
                          ? 'bg-neutral-900 text-white'
                          : 'hover:bg-neutral-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm mb-3 text-neutral-700">Khoảng giá</h3>
                <input
                  type="range"
                  min="0"
                  max="50000000"
                  step="1000000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-neutral-600 mt-2">
                  <span>0₫</span>
                  <span>{priceRange[1].toLocaleString('vi-VN')}₫</span>
                </div>
              </div>

              {/* Reset */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSelectedCategory('Tất cả');
                  setPriceRange([0, 50000000]);
                }}
              >
                Đặt lại bộ lọc
              </Button>
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Bộ lọc
            </Button>

            {showFilters && (
              <div className="bg-white rounded-lg p-6 mt-4">
                <div className="mb-6">
                  <h3 className="text-sm mb-3 text-neutral-700">Danh mục</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`text-left px-3 py-2 rounded-md transition-colors text-sm ${
                          selectedCategory === category
                            ? 'bg-neutral-900 text-white'
                            : 'bg-neutral-100 hover:bg-neutral-200'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm mb-3 text-neutral-700">Khoảng giá</h3>
                  <input
                    type="range"
                    min="0"
                    max="50000000"
                    step="1000000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-neutral-600 mt-2">
                    <span>0₫</span>
                    <span>{priceRange[1].toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedCategory('Tất cả');
                    setPriceRange([0, 50000000]);
                  }}
                >
                  Đặt lại bộ lọc
                </Button>
              </div>
            )}
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-neutral-600">
                Hiển thị {sortedProducts.length} sản phẩm
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900"
              >
                <option>Mới nhất</option>
                <option>Giá thấp đến cao</option>
                <option>Giá cao đến thấp</option>
                <option>Phổ biến nhất</option>
              </select>
            </div>

            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-neutral-600 text-lg">
                  Không tìm thấy sản phẩm phù hợp
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
