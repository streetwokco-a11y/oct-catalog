import React, { useState } from 'react';
import { X, Star, ShieldCheck, Truck, ShoppingBag, Check, Heart, Cpu, Sparkles } from 'lucide-react';

export default function ProductModal({ product, onClose, onAddToCart, isFav, onToggleFav }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel rounded-3xl border border-[var(--border-color)] p-6 sm:p-8 bg-[var(--bg-primary)] shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Image Showcase */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-indigo-600/90 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                {product.badge}
              </span>
            )}
          </div>

          {/* Product Info & Specs */}
          <div className="space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                {product.category.replace('-', ' ')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] mt-1 leading-tight">
                {product.name}
              </h2>
              
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{product.rating}</span>
                  <span className="text-[var(--text-muted)] font-normal">({product.reviewsCount} reviews)</span>
                </div>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {product.stock} units available
                </span>
              </div>
            </div>

            {/* Price Tag */}
            <div className="flex items-baseline gap-3 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <span className="text-3xl font-black text-[var(--text-primary)]">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-base text-[var(--text-muted)] line-through">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {product.description}
            </p>

            {/* Specifications Table */}
            {product.specs && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-indigo-400" /> Technical Specifications
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                      <span className="text-[var(--text-muted)] block text-[10px]">{key}</span>
                      <span className="font-semibold text-[var(--text-primary)]">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features Bullet List */}
            {product.features && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-400" /> Key Features
                </h4>
                <ul className="space-y-1.5">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="text-xs text-[var(--text-secondary)] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity Selector & Action Buttons */}
            <div className="pt-4 border-t border-[var(--border-color)] flex flex-wrap items-center gap-3">
              <div className="flex items-center border border-[var(--border-color)] rounded-xl bg-[var(--bg-secondary)]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-sm font-bold hover:bg-[var(--bg-tertiary)] rounded-l-xl"
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm font-bold text-[var(--text-primary)]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-sm font-bold hover:bg-[var(--bg-tertiary)] rounded-r-xl"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                  added 
                    ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" /> Added to Order!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" /> Add to Cart (${(product.price * quantity).toLocaleString()})
                  </>
                )}
              </button>

              <button
                onClick={() => onToggleFav(product.id)}
                className={`p-3 rounded-xl border border-[var(--border-color)] transition-all ${
                  isFav 
                    ? 'bg-rose-500 text-white border-rose-500' 
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-rose-400'
                }`}
                title="Bookmark Item"
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="flex items-center gap-6 pt-2 text-xs text-[var(--text-muted)]">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-indigo-400" /> Free Express Shipping
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 2-Year Hardware Warranty
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
