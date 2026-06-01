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
    <div className="group relative bg-white border border-slate-100 hover:border-zinc-300 transition-all duration-300 flex flex-col overflow-hidden h-full">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={product.imageUrl}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />
        
        {/* Badges / Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          <span className="text-[9px] uppercase tracking-widest font-bold bg-white/90 backdrop-blur-xs text-zinc-800 px-2 py-0.5 border border-zinc-200">
            {product.category}
          </span>
          {product.stock < 5 && product.stock > 0 && (
            <span className="text-[9px] uppercase tracking-wider font-semibold bg-amber-500 text-white px-2 py-0.5">
              Only {product.stock} left
            </span>
          )}
          {isOutOfStock && (
            <span className="text-[9px] uppercase tracking-wider font-extrabold bg-zinc-900 text-white px-2.5 py-1">
              Sold Out
            </span>
          )}
        </div>

        {/* Floating Wishlist Button */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={onWishlistToggle}
            id={`wishlist-toggle-${product.id}`}
            className={`p-2 rounded-full border shadow-xs transition-all duration-300 ${
              isWishlisted
                ? 'bg-rose-500 border-rose-500 text-white'
                : 'bg-white border-zinc-200 text-zinc-600 hover:bg-black hover:text-white hover:border-black'
            }`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* View Details Hover Utility */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <button
            onClick={onViewDetails}
            className="pointer-events-auto flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 text-white text-[10px] font-bold uppercase tracking-widest py-2 px-3.5 shadow-md transition-transform hover:scale-105"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          {/* Rating & Stock Info */}
          <div className="flex items-center gap-1.5 mb-1.5 text-[11px] font-mono text-zinc-400">
            <div className="flex items-center text-amber-500 gap-0.5">
              <Star className="w-3 h-3 fill-current" />
              <span className="font-bold text-zinc-700">{product.rating.toFixed(1)}</span>
            </div>
            <span>•</span>
            <span>{isOutOfStock ? 'No Stock' : `${product.stock} items left`}</span>
          </div>

          <h3 
            onClick={onViewDetails}
            className="font-serif font-semibold text-zinc-900 text-sm md:text-base leading-snug line-clamp-2 hover:opacity-75 cursor-pointer transition-opacity mb-1"
          >
            {product.name}
          </h3>

          <p className="text-xs text-zinc-500 line-clamp-2 mb-3 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Cost & Add to Cart Action */}
        <div className="flex items-center justify-between gap-1 pt-3 border-t border-zinc-100 mt-2">
          <div className="flex flex-col">
            <span className="text-[9px] text-zinc-450 uppercase tracking-widest font-bold">Price</span>
            <span className="font-sans text-sm font-extrabold text-zinc-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={onAddToCart}
            id={`add-to-cart-${product.id}`}
            disabled={isOutOfStock}
            className={`flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider py-1.5 px-3.5 transition-all duration-200 cursor-pointer ${
              isOutOfStock
                ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200'
                : 'bg-zinc-950 hover:bg-zinc-850 text-white shadow-xs active:scale-95 border border-zinc-950'
            }`}
          >
            <ShoppingBag className="w-3 h-3" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

