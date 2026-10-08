import React, { useState } from 'react';
import { api } from '../services/api';
import { 
  CheckSquare, 
  Square, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  BarChart3, 
  ArrowRight,
  Layers
} from 'lucide-react';

export default function BatchOptimizerView({ products, onSelectForApproval }) {
  const [selectedProductIds, setSelectedProductIds] = useState(products.map(p => p.id));
  const [targetChannel, setTargetChannel] = useState('amazon');
  const [processing, setProcessing] = useState(false);
  const [batchResults, setBatchResults] = useState(null);

  const toggleSelectAll = () => {
    if (selectedProductIds.length === products.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(products.map(p => p.id));
    }
  };

  const toggleSelectProduct = (id) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleRunBatch = async () => {
    if (selectedProductIds.length === 0) return;
    setProcessing(true);
    const results = [];

    for (const id of selectedProductIds) {
      const prod = products.find(p => p.id === id);
      if (prod) {
        try {
          const opt = await api.runOptimization(prod, targetChannel);
          results.push({ product: prod, optimization: opt, status: 'SUCCESS' });
        } catch (err) {
          results.push({ product: prod, error: err.message, status: 'FAILED' });
        }
      }
    }

    setBatchResults(results);
    setProcessing(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl border border-[var(--border-color)] p-6 bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5" /> Multi-SKU Intelligence Engine
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            Batch SKU Optimization Mode
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Audit and generate channel-tailored copy for multiple catalog products simultaneously.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={targetChannel}
            onChange={(e) => setTargetChannel(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-bold text-indigo-400 uppercase focus:outline-none"
          >
            <option value="amazon">Amazon Rules</option>
            <option value="flipkart">Flipkart Rules</option>
            <option value="shopify">Shopify Rules</option>
            <option value="myntra">Myntra Rules</option>
            <option value="nykaa">Nykaa Rules</option>
          </select>

          <button
            onClick={handleRunBatch}
            disabled={processing || selectedProductIds.length === 0}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all disabled:opacity-50 whitespace-nowrap"
          >
            <Zap className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} />
            {processing ? `Processing (${selectedProductIds.length} SKUs)...` : `Run Batch Optimization (${selectedProductIds.length} SKUs)`}
          </button>
        </div>
      </div>

      {/* SKU Selector Table */}
      <div className="glass-panel rounded-3xl border border-[var(--border-color)] overflow-hidden">
        <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-secondary)]/50 text-xs font-bold">
          <div className="flex items-center gap-3 cursor-pointer" onClick={toggleSelectAll}>
            {selectedProductIds.length === products.length ? (
              <CheckSquare className="w-4 h-4 text-indigo-400" />
            ) : (
              <Square className="w-4 h-4 text-[var(--text-muted)]" />
            )}
            <span>Select All Catalog Items ({selectedProductIds.length} of {products.length} selected)</span>
          </div>
          <span className="text-[var(--text-muted)] uppercase">Channel: {targetChannel.toUpperCase()}</span>
        </div>

        <div className="divide-y divide-[var(--border-color)]">
          {products.map((p) => {
            const isSelected = selectedProductIds.includes(p.id);
            const batchItem = batchResults ? batchResults.find(r => r.product.id === p.id) : null;

            return (
              <div 
                key={p.id}
                onClick={() => toggleSelectProduct(p.id)}
                className={`p-4 flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                  isSelected ? 'bg-indigo-600/5' : 'hover:bg-[var(--bg-secondary)]/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-indigo-400 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                  )}
                  <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-[var(--bg-tertiary)]" />
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-primary)]">{p.name}</h4>
                    <span className="text-[10px] text-[var(--text-muted)] font-mono">{p.sku || p.id} • ${p.price}</span>
                  </div>
                </div>

                <div>
                  {batchItem && batchItem.status === 'SUCCESS' && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Score: {batchItem.optimization?.result?.scoringDifferential?.beforeScore ?? 65}% ➔ {batchItem.optimization?.result?.scoringDifferential?.afterScore ?? 95}%
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectForApproval(p, targetChannel);
                        }}
                        className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[10px] flex items-center gap-1 hover:bg-indigo-500"
                      >
                        Review <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
