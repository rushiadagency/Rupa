import React from 'react';
import { Product } from '../types';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

interface ProductDetailsModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  isWishlisted: boolean;
  onWishlistToggle: () => void;
  onAddToCart: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  isOpen,
  onClose,
  isWishlisted,
  onWishlistToggle,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[85vh]">
        
        {/* Dismiss Button */}
        <button
          onClick={onClose}
          id="close-details-modal"
          className="absolute right-4 top-4 z-10 p-1.5 rounded-full bg-white/95 text-slate-500 hover:text-slate-800 shadow-sm border border-slate-100 transition-transform hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Visual Media Row */}
        <div className="w-full md:w-1/2 relative bg-slate-50 aspect-square md:aspect-auto">
          <img
            src={product.imageUrl}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="text-[10px] uppercase font-bold tracking-wider bg-indigo-600 text-white px-2.5 py-1 rounded-full">
              {product.category}
            </span>
          </div>
        </div>

        {/* Technical description row */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Upper stats */}
            <div className="flex items-center gap-4 mb-3">
              {/* Star review overlay */}
              <div className="flex items-center text-amber-500 text-xs font-semibold gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span>({product.rating.toFixed(1)})</span>
              </div>

              <span className="h-4 w-px bg-slate-200"></span>

              <span className={`text-[11px] font-bold ${product.stock <= 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                {product.stock <= 0 ? 'Out of stock' : `${product.stock} items left in stock`}
              </span>
            </div>

            <h3 className="text-lg md:text-xl font-bold text-slate-900 font-sans leading-snug mb-1">
              {product.name}
            </h3>

            <p className="font-mono text-lg font-black text-slate-900 mb-4">
              ₹{product.price.toLocaleString('en-IN')}
            </p>

            <div className="border-t border-slate-50 pt-4 mb-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Overview</p>
              <p className="text-xs text-slate-600 leading-relaxed font-sans mb-4">
                {product.description}
              </p>
            </div>

            {/* Micro value badges */}
            <div className="grid grid-cols-2 gap-2.5 mb-6 text-[10px] text-slate-500 font-medium">
              <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl">
                <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Express Delivery Option Available</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pay on Delivery (COD)</span>
              </div>
            </div>
          </div>

          {/* Checkout Controls */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
            <button
              onClick={onAddToCart}
              id={`details-add-to-cart-${product.id}`}
              disabled={isOutOfStock}
              className={`flex-grow flex items-center justify-center gap-2 text-xs font-semibold py-3 px-4 rounded-xl transition-all ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-slate-900 text-white shadow active:scale-95'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isOutOfStock ? 'Out of Stock' : 'Add to Shopping Cart'}</span>
            </button>

            <button
              onClick={onWishlistToggle}
              id={`details-wishlist-toggle-${product.id}`}
              className={`p-3 rounded-xl border transition-colors ${
                isWishlisted
                  ? 'bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-rose-600'
              }`}
              title={isWishlisted ? 'Remove Wishlist' : 'Save Wishlist'}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
