import React from 'react';
import { Sparkles, ShieldCheck, Zap, ArrowRight, Cpu } from 'lucide-react';
import { CATALOG_STATS } from '../data/catalogData';

export default function HeroBanner({ onExploreClick }) {
  return (
    <div className="relative overflow-hidden rounded-3xl glass-panel border border-[var(--border-color)] mb-8 p-6 sm:p-10 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900/40">
      
      {/* Background Decorative Ambient Orbs */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Content */}
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Next-Generation Catalog 2026
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight leading-[1.15]">
            Discover Extraordinary <br />
            <span className="gradient-text">AI & High-Tech Hardware</span>
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-xl font-normal leading-relaxed">
            Explore our curated inventory of enterprise AI workstations, spatial vision computing, haptic wearables, and smart automation modules.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onExploreClick}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              Explore All Items <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Certified Direct Warranty</span>
            </div>
          </div>
        </div>

        {/* Right Stats & Highlights Card */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded-2xl bg-[var(--bg-secondary)]/80 border border-[var(--border-color)] shadow-2xl space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-indigo-400" /> Catalog Overview
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                Live Inventory
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                <p className="text-xs text-[var(--text-muted)]">Active Products</p>
                <p className="text-2xl font-extrabold text-[var(--text-primary)] mt-1">{CATALOG_STATS.totalProducts}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                <p className="text-xs text-[var(--text-muted)]">Stock Available</p>
                <p className="text-2xl font-extrabold text-emerald-400 mt-1">{CATALOG_STATS.inStockCount} units</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                <p className="text-xs text-[var(--text-muted)]">Customer Satisfaction</p>
                <p className="text-2xl font-extrabold text-amber-400 mt-1">★ {CATALOG_STATS.avgRating}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                <p className="text-xs text-[var(--text-muted)]">Lead Category</p>
                <p className="text-sm font-bold text-sky-400 mt-2 truncate">{CATALOG_STATS.topCategory}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
