import React from 'react';
import { CATEGORIES } from '../data/catalogData';
import { ArrowUpDown, Filter } from 'lucide-react';

export default function CategoryFilter({ 
  selectedCategory, 
  setSelectedCategory,
  sortBy,
  setSortBy,
  showFilters
}) {
  return (
    <div className={`mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${showFilters ? 'block' : 'hidden md:flex'}`}>
      
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20 scale-[1.02]'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Sorting Dropdown */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-[var(--text-muted)] flex items-center gap-1.5 whitespace-nowrap">
          <ArrowUpDown className="w-3.5 h-3.5" /> Sort By:
        </span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-[var(--accent-primary)] cursor-pointer"
        >
          <option value="featured">Featured / Popular</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

    </div>
  );
}
