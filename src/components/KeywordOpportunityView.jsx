import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { KeyRound, Sparkles, Plus, Check, Search, TrendingUp } from 'lucide-react';

export default function KeywordOpportunityView({ products }) {
  const [selectedProduct, setSelectedProduct] = useState(products[0] || null);
  const [keywordData, setKeywordData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [injected, setInjected] = useState(false);

  const fetchKeywords = async (prod) => {
    if (!prod) return;
    setLoading(true);
    try {
      const res = await api.getKeywordOpportunities(prod, prod.category);
      setKeywordData(res);
    } catch (err) {
      console.error('Keyword discovery error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProduct) {
      fetchKeywords(selectedProduct);
    }
  }, [selectedProduct]);

  const handleInjectKeywords = () => {
    setInjected(true);
    setTimeout(() => setInjected(false), 3000);
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl border border-[var(--border-color)] p-6 bg-gradient-to-r from-sky-950/40 via-indigo-950/30 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
            <KeyRound className="w-3.5 h-3.5" /> High-Converting Search Intent
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            Keyword Opportunity Discovery Engine
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Extracts high-volume long-tail terms and unused backend search keywords for your catalog category.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedProduct ? selectedProduct.id : ''}
            onChange={(e) => setSelectedProduct(products.find(p => p.id === e.target.value))}
            className="px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] focus:outline-none"
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <button
            onClick={handleInjectKeywords}
            disabled={injected || !keywordData}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg transition-all ${
              injected
                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            {injected ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            {injected ? 'Keywords Injected!' : 'Inject Keywords into Optimizer'}
          </button>
        </div>
      </div>

      {loading || !keywordData ? (
        <div className="py-20 text-center glass-panel rounded-3xl border border-[var(--border-color)] my-6">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-[var(--text-muted)]">Discovering search volume opportunities...</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <span className="text-xs text-[var(--text-muted)]">Total Discovered Keywords</span>
              <p className="text-2xl font-black text-[var(--text-primary)] mt-1">{keywordData.totalKeywordsDiscovered}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <span className="text-xs text-[var(--text-muted)]">Missing Opportunity Terms</span>
              <p className="text-2xl font-black text-sky-400 mt-1">{keywordData.missingOpportunityCount}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <span className="text-xs text-[var(--text-muted)]">Category Search Velocity</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">High Intent</p>
            </div>
          </div>

          {/* Keyword Opportunity Table */}
          <div className="glass-panel rounded-3xl border border-[var(--border-color)] overflow-hidden">
            <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/50 flex justify-between items-center text-xs font-bold text-[var(--text-muted)]">
              <span>KEYWORD / SEARCH TERM</span>
              <span>SEARCH VOLUME & STATUS</span>
            </div>

            <div className="divide-y divide-[var(--border-color)]">
              {keywordData.keywords.map((kw, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="font-extrabold text-[var(--text-primary)] block text-sm">{kw.term}</span>
                    <span className="text-[10px] text-[var(--text-muted)]">Competition: {kw.competition} • Relevance: {kw.relevance}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sky-400">{kw.searchVolume}</span>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase border ${
                      kw.alreadyInCopy 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    }`}>
                      {kw.alreadyInCopy ? 'In Copy' : kw.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
