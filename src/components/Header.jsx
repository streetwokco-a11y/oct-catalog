import React from 'react';
import { 
  Boxes, 
  Search, 
  ShoppingBag, 
  Heart, 
  Sun, 
  Moon, 
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';

export default function Header({ 
  searchQuery, 
  setSearchQuery, 
  theme, 
  toggleTheme, 
  cartCount, 
  favCount, 
  onOpenCart,
  showFilters,
  setShowFilters
}) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-[var(--border-color)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-sky-400 p-[2px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[var(--bg-primary)] rounded-[10px] flex items-center justify-center">
              <Boxes className="w-6 h-6 text-indigo-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-2xl tracking-tight text-[var(--text-primary)]">OCT</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> v2.4
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] tracking-wide font-medium">Enterprise Product Catalog</p>
          </div>
        </div>

        {/* Live Search Input */}
        <div className="flex-1 max-w-xl relative hidden md:block">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 absolute left-3.5 text-[var(--text-muted)] pointer-events-none" />
            <input
              type="text"
              placeholder="Search catalog products, specs, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Quick Actions & Toggles */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Mobile Filter Toggle Button */}
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all md:hidden ${showFilters ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400' : ''}`}
            title="Filter Catalog"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all"
            title="Toggle Dark / Light Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600" />
            )}
          </button>

          {/* Favorites Counter */}
          <div className="relative">
            <button 
              className="p-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent-rose)] hover:bg-[var(--bg-secondary)] transition-all"
              title="Saved Favorites"
            >
              <Heart className="w-5 h-5" />
              {favCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {favCount}
                </span>
              )}
            </button>
          </div>

          {/* Shopping Cart Drawer Trigger */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-bold">
              {cartCount}
            </span>
          </button>
        </div>

      </div>

      {/* Mobile Search Bar Row */}
      <div className="px-4 pb-3 md:hidden">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3.5 text-[var(--text-muted)] pointer-events-none" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
          />
        </div>
      </div>
    </header>
  );
}
