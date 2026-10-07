import React from 'react';
import { Star, Heart, ShoppingBag, Eye, Check, Globe } from 'lucide-react';

export default function ProductCard({ 
  product, 
  onQuickView, 
  onAddToCart, 
  isFav, 
  onToggleFav,
  isInCart
}) {
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const activeChannels = product.marketplaceSync ? Object.keys(product.marketplaceSync) : ['amazon', 'flipkart', 'shopify', 'myntra', 'nykaa'];

  return (
    <div className="group relative rounded-2xl glass-panel border border-[var(--border-color)] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--border-color-hover)] hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col h-full">
      
      {/* Product Image & Badges */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-tertiary)]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="px-2.5 py-1 rounded-lg bg-indigo-600/90 text-white text-[10px] font-bold tracking-wider uppercase shadow-md backdrop-blur-md">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-rose-500/90 text-white text-[10px] font-bold tracking-wider uppercase shadow-md backdrop-blur-md">
              -{discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFav(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all z-10 ${
            isFav 
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
              : 'bg-black/40 text-white/80 hover:text-white hover:bg-black/60'
          }`}
          title="Add to Favorites"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Hover Button */}
        <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 z-10 px-4">
          <button
            onClick={() => onQuickView(product)}
            className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1.5">
            <span className="uppercase tracking-wider font-semibold text-indigo-400">
              {product.category.replace('-', ' ')}
            </span>
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating}</span>
              <span className="text-[var(--text-muted)] font-normal">({product.reviewsCount || 42})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onQuickView(product)}
            className="font-bold text-base text-[var(--text-primary)] hover:text-indigo-400 cursor-pointer line-clamp-1 transition-colors"
          >
            {product.name}
          </h3>

          <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-1 font-normal leading-relaxed">
            {product.description}
          </p>

          {/* Marketplace Sync Badges Bar */}
          <div className="flex items-center gap-1 mt-3 pt-2 border-t border-[var(--border-color)]">
            <span className="text-[10px] text-[var(--text-muted)] font-semibold mr-1 flex items-center gap-1">
              <Globe className="w-3 h-3 text-indigo-400" /> Synced:
            </span>
            {activeChannels.map(ch => (
              <span 
                key={ch} 
                className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase"
                title={`Synced to ${ch}`}
              >
                {ch.slice(0, 3)}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-[var(--text-primary)]">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-[var(--text-muted)] line-through">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <p className="text-[10px] text-emerald-400 font-medium mt-0.5">
              In Stock ({product.stock} units)
            </p>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className={`p-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 ${
              isInCart
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 active:scale-95'
            }`}
            title="Add to Cart"
          >
            {isInCart ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
