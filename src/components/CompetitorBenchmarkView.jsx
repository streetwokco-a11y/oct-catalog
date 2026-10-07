import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Star, 
  ArrowRight,
  ShieldCheck,
  Search
} from 'lucide-react';

export default function CompetitorBenchmarkView({ products }) {
  const [selectedProduct, setSelectedProduct] = useState(products[0] || null);
  const [competitorAsin, setCompetitorAsin] = useState('B09X98102A');
  const [benchmark, setBenchmark] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBenchmark = async (prod, asin) => {
    if (!prod) return;
    setLoading(true);
    try {
      const res = await api.getCompetitorBenchmark(prod, asin);
      setBenchmark(res);
    } catch (err) {
      console.error('Benchmark error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProduct) {
      fetchBenchmark(selectedProduct, competitorAsin);
    }
  }, [selectedProduct, competitorAsin]);

  if (!products || products.length === 0) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl border border-[var(--border-color)] p-6 bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" /> Market Competitor Benchmarking
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            Competitor Listing Benchmark Analyzer
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Benchmark your catalog listing side-by-side against top market competitor ASINs/products.
          </p>
        </div>

        {/* Product & Competitor Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedProduct ? selectedProduct.id : ''}
            onChange={(e) => setSelectedProduct(products.find(p => p.id === e.target.value))}
            className="px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] focus:outline-none"
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select
            value={competitorAsin}
            onChange={(e) => setCompetitorAsin(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-bold text-indigo-400 focus:outline-none"
          >
            <option value="B09X98102A">Nvidia MaxWorkstation (ASIN: B09X98102A)</option>
            <option value="B08Y77219B">Apple MacStudio Ultra (ASIN: B08Y77219B)</option>
          </select>
        </div>
      </div>

      {loading || !benchmark ? (
        <div className="py-20 text-center glass-panel rounded-3xl border border-[var(--border-color)] my-6">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-[var(--text-muted)]">Analyzing competitor listing metrics...</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Side-by-Side Benchmark Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Your Listing */}
            <div className="p-6 rounded-3xl glass-panel border border-indigo-500/40 bg-indigo-950/20 space-y-4">
              <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Your Catalog Item
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                  SKU: {selectedProduct.sku || selectedProduct.id}
                </span>
              </div>

              <h3 className="font-extrabold text-lg text-[var(--text-primary)]">{selectedProduct.name}</h3>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                  <span className="text-[var(--text-muted)] block text-[10px]">PRICE POINT</span>
                  <span className="text-lg font-extrabold text-emerald-400">${selectedProduct.price}</span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                  <span className="text-[var(--text-muted)] block text-[10px]">RATING & REVIEWS</span>
                  <span className="text-sm font-bold text-amber-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" /> {selectedProduct.rating || 5.0} ({selectedProduct.reviewsCount || 128})
                  </span>
                </div>
              </div>
            </div>

            {/* Competitor Listing */}
            <div className="p-6 rounded-3xl glass-panel border border-[var(--border-color)] space-y-4 bg-[var(--bg-primary)]">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  Competitor Target: {benchmark.competitor.brand}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono font-bold">
                  {benchmark.competitor.asin}
                </span>
              </div>

              <h3 className="font-extrabold text-lg text-[var(--text-primary)]">{benchmark.competitor.name}</h3>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                  <span className="text-[var(--text-muted)] block text-[10px]">COMPETITOR PRICE</span>
                  <span className="text-lg font-extrabold text-[var(--text-primary)]">${benchmark.competitor.price}</span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                  <span className="text-[var(--text-muted)] block text-[10px]">RATING & REVIEWS</span>
                  <span className="text-sm font-bold text-amber-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" /> {benchmark.competitor.rating} ({benchmark.competitor.reviewsCount})
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Advantages vs Gaps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl glass-panel border border-emerald-500/30 space-y-3 bg-emerald-950/10">
              <h4 className="font-extrabold text-base text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Your Competitive Advantages
              </h4>
              <ul className="space-y-2 text-xs text-[var(--text-primary)]">
                {benchmark.keyAdvantages.map((adv, i) => (
                  <li key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-3xl glass-panel border border-amber-500/30 space-y-3 bg-amber-950/10">
              <h4 className="font-extrabold text-base text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Gaps To Outrank Competitor
              </h4>
              <ul className="space-y-2 text-xs text-[var(--text-primary)]">
                {benchmark.gapsToOutrank.map((gap, i) => (
                  <li key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
