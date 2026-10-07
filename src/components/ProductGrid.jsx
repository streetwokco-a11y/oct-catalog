import React from 'react';
import ProductCard from './ProductCard';
import { PackageSearch } from 'lucide-react';

export default function ProductGrid({ 
  products, 
  onQuickView, 
  onAddToCart, 
  favorites, 
  onToggleFav,
  cartItems 
}) {
  const cartItemIds = new Set(cartItems.map(item => item.id));

  if (products.length === 0) {
    return (
      <div className="py-20 text-center glass-panel rounded-3xl border border-[var(--border-color)] p-8 my-6">
        <PackageSearch className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4 animate-bounce" />
        <h3 className="text-xl font-bold text-[var(--text-primary)]">No Catalog Items Found</h3>
        <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-md mx-auto">
          We couldn't find any products matching your active search query or filter selection. Try resetting filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onQuickView={onQuickView}
          onAddToCart={onAddToCart}
          isFav={favorites.includes(product.id)}
          onToggleFav={onToggleFav}
          isInCart={cartItemIds.has(product.id)}
        />
      ))}
    </div>
  );
}
