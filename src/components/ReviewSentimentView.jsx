import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { MessageSquare, ThumbsUp, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ReviewSentimentView({ products }) {
  const [selectedProduct, setSelectedProduct] = useState(products[0] || null);
  const [sentimentData, setSentimentData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSentiment = async (prod) => {
    if (!prod) return;
    setLoading(true);
    try {
      const res = await api.getReviewSentiment(prod);
      setSentimentData(res);
    } catch (err) {
      console.error('Sentiment error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProduct) {
      fetchSentiment(selectedProduct);
    }
  }, [selectedProduct]);

  if (!products || products.length === 0) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl border border-[var(--border-color)] p-6 bg-gradient-to-r from-emerald-950/40 via-indigo-950/30 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <MessageSquare className="w-3.5 h-3.5" /> Customer Feedback & Objection Mining
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            Review Sentiment & Pain-Point Extractor
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Uncovers buyer praise points, friction triggers, and generates bullet points that overcome objections.
          </p>
        </div>

        <select
          value={selectedProduct ? selectedProduct.id : ''}
          onChange={(e) => setSelectedProduct(products.find(p => p.id === e.target.value))}
          className="px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] focus:outline-none"
        >
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {loading || !sentimentData ? (
        <div className="py-20 text-center glass-panel rounded-3xl border border-[var(--border-color)] my-6">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-[var(--text-muted)]">Extracting review sentiment...</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Sentiment Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <span className="text-xs text-[var(--text-muted)]">Analyzed Customer Reviews</span>
              <p className="text-2xl font-black text-[var(--text-primary)] mt-1">{sentimentData.totalReviewsAnalyzed} Verified Reviews</p>
            </div>
            <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <span className="text-xs text-[var(--text-muted)]">Overall Sentiment Score</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">{sentimentData.sentimentScore}</p>
            </div>
          </div>

          {/* Praise Points vs Pain Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl glass-panel border border-emerald-500/30 space-y-3 bg-emerald-950/10">
              <h4 className="font-extrabold text-base text-emerald-400 flex items-center gap-2">
                <ThumbsUp className="w-5 h-5" /> Top Customer Praise Points
              </h4>
              <ul className="space-y-2 text-xs text-[var(--text-primary)]">
                {sentimentData.praisePoints.map((p, i) => (
                  <li key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-3xl glass-panel border border-amber-500/30 space-y-3 bg-amber-950/10">
              <h4 className="font-extrabold text-base text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Customer Friction & Pain Points
              </h4>
              <ul className="space-y-2 text-xs text-[var(--text-primary)]">
                {sentimentData.painPoints.map((p, i) => (
                  <li key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Auto-Generated Objection Busting Bullets */}
          <div className="p-6 rounded-3xl glass-panel border border-indigo-500/40 space-y-4 bg-indigo-950/20">
            <h3 className="font-extrabold text-base text-indigo-400 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" /> Auto-Generated Objection-Busting Bullets
            </h3>
            <div className="space-y-2 text-xs">
              {sentimentData.objectionBustingBullets.map((b, i) => (
                <div key={i} className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-indigo-500/30 font-bold text-[var(--text-primary)]">
                  • {b}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
