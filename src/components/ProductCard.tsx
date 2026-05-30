import React from 'react';
import { Product } from '../types';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onWishlistToggle: () => void;
  onAddToCart: () => void;
  onViewDetails: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onWishlistToggle,
  onAddToCart,
  onViewDetails,
}) => {
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden h-full">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={product.imageUrl}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges / Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          <span className="text-[10px] uppercase tracking-wider font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
            {product.category}
          </span>
          {product.stock < 5 && product.stock > 0 && (
            <span className="text-[10px] font-medium bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              Only {product.stock} left
            </span>
          )}
          {isOutOfStock && (
            <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2.5 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>

        {/* Floating Quick Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={onWishlistToggle}
            id={`wishlist-toggle-${product.id}`}
            className={`p-2.5 rounded-full border shadow-sm transition-all duration-300 ${
              isWishlisted
                ? 'bg-rose-50 border-rose-100 text-rose-600'
                : 'bg-white/90 border-slate-100 text-slate-600 hover:bg-white hover:text-rose-600'
            }`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
          </button>
        </div>

        {/* View Details Hover Utility */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <button
            onClick={onViewDetails}
            className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/90 text-white hover:bg-slate-900 border border-slate-700/50 text-xs font-semibold tracking-wide py-2 px-4 rounded-xl shadow-lg transition-transform hover:scale-105"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Rating & Stock Info */}
        <div className="flex items-center justify-between gap-2 mb-1.5 text-xs">
          <div className="flex items-center text-amber-500 gap-0.5">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="font-semibold">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-slate-500">
            {isOutOfStock ? '0 items left' : `${product.stock} items left`}
          </span>
        </div>

        <h3 
          onClick={onViewDetails}
          className="font-sans font-semibold text-slate-800 text-sm md:text-base leading-snug line-clamp-2 hover:text-indigo-600 cursor-pointer transition-colors mb-2"
        >
          {product.name}
        </h3>

        <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>

        {/* Cost & Add to Cart Action */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Price</span>
            <span className="font-mono text-base font-bold text-slate-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={onAddToCart}
            id={`add-to-cart-${product.id}`}
            disabled={isOutOfStock}
            className={`flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3.5 rounded-xl transition-all duration-200 ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow active:scale-95'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
