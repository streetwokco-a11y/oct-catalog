import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import ClaimGuardBadge from './ClaimGuardBadge';
import { 
  AlertTriangle, 
  BarChart3, 
  Image as ImageIcon, 
  FileText, 
  Sliders, 
  Globe, 
  KeyRound,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export default function ListingGapReportView({ products, onSelectForOptimization }) {
  const [selectedProduct, setSelectedProduct] = useState(products[0] || null);
  const [selectedChannel, setSelectedChannel] = useState('amazon');
  const [auditResult, setAuditResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runAudit = async (prod, channel) => {
    if (!prod) return;
    setLoading(true);
    try {
      const res = await api.runAudit(prod, channel);
      setAuditResult(res);
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProduct) {
      runAudit(selectedProduct, selectedChannel);
    }
  }, [selectedProduct, selectedChannel]);

  if (!products || products.length === 0) {
    return (
      <div className="py-20 text-center glass-panel rounded-3xl border border-[var(--border-color)] my-6">
        <p className="text-sm font-semibold text-[var(--text-muted)]">No products available to audit.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Controls */}
      <div className="glass-panel rounded-3xl border border-[var(--border-color)] p-6 bg-gradient-to-r from-slate-900 via-purple-950/20 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
            <BarChart3 className="w-3.5 h-3.5" /> 6-Metric Gap Audit & Traceable Explanations
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            Digital Shelf Audit Engine
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Audits listing content against Amazon, Flipkart, Shopify, Myntra, and Nykaa JSON rule schemas.
          </p>
        </div>

        {/* Product & Channel Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedProduct ? selectedProduct.id : ''}
            onChange={(e) => {
              const p = products.find(x => x.id === e.target.value);
              setSelectedProduct(p);
            }}
            className="px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] font-bold focus:outline-none"
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-indigo-400 font-bold focus:outline-none uppercase"
          >
            <option value="amazon">Amazon Rules</option>
            <option value="flipkart">Flipkart Rules</option>
            <option value="shopify">Shopify Rules</option>
            <option value="myntra">Myntra Rules</option>
            <option value="nykaa">Nykaa Rules</option>
          </select>
        </div>
      </div>

      {loading || !auditResult ? (
        <div className="py-20 text-center glass-panel rounded-3xl border border-[var(--border-color)] my-6">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-[var(--text-muted)]">Running Audit for {selectedChannel.toUpperCase()}...</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Overall Health Gauge Banner */}
          <div className="p-6 rounded-3xl glass-panel border border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-[2px]">
                <div className="w-full h-full bg-[var(--bg-primary)] rounded-[14px] flex flex-col items-center justify-center">
                  <span className="text-3xl font-black gradient-text">{auditResult.overallScore}%</span>
                  <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase">Health Score</span>
                </div>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Target Channel: {selectedChannel.toUpperCase()}
                </span>
                <h3 className="text-xl font-extrabold text-[var(--text-primary)] mt-1">
                  {selectedProduct.name}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {auditResult.explanations ? auditResult.explanations.length : 0} Failed rules flagged across 6 digital shelf metrics.
                </p>
              </div>
            </div>

            <button
              onClick={() => onSelectForOptimization(selectedProduct, selectedChannel)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" /> Optimize This Listing with AI
            </button>
          </div>

          {/* 6 Core Metric Scorecards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-400" /> 1. Title SEO
                </span>
                <span className="text-sm font-extrabold text-indigo-400">{auditResult.metrics.titleSeo.score}/100</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">Length: {auditResult.metrics.titleSeo.length} chars</p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-sky-400" /> 2. Bullet Persuasiveness
                </span>
                <span className="text-sm font-extrabold text-sky-400">{auditResult.metrics.bulletPersuasiveness.score}/100</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">Bullets Count: {auditResult.metrics.bulletPersuasiveness.count}</p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-purple-400" /> 3. Image Completeness
                </span>
                <span className="text-sm font-extrabold text-purple-400">{auditResult.metrics.imageAssets.score}/100</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">Resolution: {auditResult.metrics.imageAssets.minResolution}</p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-emerald-400" /> 4. Attribute Specs
                </span>
                <span className="text-sm font-extrabold text-emerald-400">{auditResult.metrics.specCoverage.score}/100</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">Category Schema Populated</p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-amber-400" /> 5. Channel Rules
                </span>
                <span className="text-sm font-extrabold text-amber-400">{auditResult.metrics.titleSeo.score}/100</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">Rules Engine: {selectedChannel.toUpperCase()} JSON</p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-rose-400" /> 6. Backend Terms
                </span>
                <span className="text-sm font-extrabold text-rose-400">100/100</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">Allowance: 249 Bytes</p>
            </div>
          </div>

          {/* Traceable Audit Explanations Section */}
          {auditResult.explanations && auditResult.explanations.length > 0 && (
            <div className="p-6 rounded-3xl glass-panel border border-[var(--border-color)] space-y-3">
              <h3 className="font-extrabold text-base text-[var(--text-primary)] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" /> Traceable Failed Rules & Fix Recommendations
              </h3>
              <div className="space-y-3 text-xs">
                {auditResult.explanations.map((exp, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-amber-400">{exp.metric} ({exp.ruleId})</span>
                    </div>
                    <p className="text-amber-200 font-semibold">{exp.failedRule}</p>
                    <p className="text-amber-300/80 text-[11px]">💡 <strong>Recommendation:</strong> {exp.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Claim Guard Inspection Card */}
          {auditResult.claimGuard && (
            <ClaimGuardBadge claims={auditResult.claimGuard.claims} />
          )}

        </div>
      )}

    </div>
  );
}
