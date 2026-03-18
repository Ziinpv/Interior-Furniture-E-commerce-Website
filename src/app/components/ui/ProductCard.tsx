import React from 'react';
import { Heart, Star } from 'lucide-react';
import { Product } from '../../data/products';
import { motion } from 'motion/react';
import { Link } from 'react-router';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
    >
      <Link to={`/products/${product.id}`} className="block relative overflow-hidden bg-neutral-100 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {discount > 0 && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
            -{discount}%
          </div>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
        >
          <Heart
            className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-neutral-600'}`}
          />
        </button>
      </Link>

      <div className="p-4">
        <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
          {product.category}
        </p>
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg mb-2 hover:text-neutral-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{product.rating}</span>
          </div>
          <span className="text-xs text-neutral-400">({product.reviews} đánh giá)</span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-xl text-neutral-900">
            {product.price.toLocaleString('vi-VN')}₫
          </span>
          {product.originalPrice && (
            <span className="text-sm text-neutral-400 line-through">
              {product.originalPrice.toLocaleString('vi-VN')}₫
            </span>
          )}
        </div>

        <div className="flex gap-2">
          {product.colors.slice(0, 4).map((color) => (
            <div
              key={color.name}
              className="w-6 h-6 rounded-full border-2 border-neutral-300 cursor-pointer hover:border-neutral-900 transition-colors"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
