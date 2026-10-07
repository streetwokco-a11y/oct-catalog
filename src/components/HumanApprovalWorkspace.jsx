import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import ClaimGuardBadge from './ClaimGuardBadge';
import { 
  CheckCircle2, 
  Copy, 
  Download, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  Check, 
  Globe,
  TrendingUp,
  HelpCircle
} from 'lucide-react';

function escapeCsvCell(cell) {
  if (cell === null || cell === undefined) return '""';
  const str = String(cell);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

export default function HumanApprovalWorkspace({ product, channel: initialChannel = 'amazon', onApproved }) {
  const [activeChannel, setActiveChannel] = useState(initialChannel);
  const [optimization, setOptimization] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [approved, setApproved] = useState(false);

  const fetchOptimization = async (prod, ch) => {
    if (!prod) return;
    setLoading(true);
    try {
      const opt = await api.runOptimization(prod, ch);
      setOptimization(opt);
      setApproved(opt.status === 'APPROVED');
    } catch (err) {
      console.error('Optimization error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptimization(product, activeChannel);
  }, [product, activeChannel]);

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleApprove = async () => {
    if (!optimization) return;
    try {
      await api.approveOptimization(optimization.id);
      setApproved(true);
      if (onApproved) onApproved(optimization);
    } catch (err) {
      alert('Error approving listing: ' + err.message);
    }
  };

  const handleExportCSV = () => {
    if (!optimization) return;

    const opt = optimization.result.optimized;
    const headers = ['Channel', 'Title', 'Bullet_1', 'Bullet_2', 'Bullet_3', 'Bullet_4', 'Bullet_5', 'Backend_Keywords'].map(escapeCsvCell).join(',');
    const row = [
      activeChannel,
      opt.title,
      opt.bullets[0] || '',
      opt.bullets[1] || '',
      opt.bullets[2] || '',
      opt.bullets[3] || '',
      opt.bullets[4] || '',
      opt.backendSearchTerms
    ].map(escapeCsvCell).join(',');

    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${row}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${activeChannel}_optimized_listing_${product ? product.id : 'export'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!product) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner & Channel Selector Tabs */}
      <div className="glass-panel rounded-3xl border border-[var(--border-color)] p-6 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Human Verification Checkpoint
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            Human Approval Workspace
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Verify AI-optimized copy, brand compliance, Claim Guard risk, and "Why" annotations before channel upload.
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['amazon', 'flipkart', 'shopify', 'myntra', 'nykaa'].map(ch => (
            <button
              key={ch}
              onClick={() => setActiveChannel(ch)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold uppercase transition-all flex items-center gap-1.5 whitespace-nowrap border ${
                activeChannel === ch
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> {ch}
            </button>
          ))}
        </div>
      </div>

      {/* Action Bar & Score Differential */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {optimization && optimization.result.scoringDifferential && (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-[var(--text-muted)] block text-[10px] uppercase font-bold">Comparative Optimization Impact</span>
              <span className="font-extrabold text-[var(--text-primary)]">
                Original: <span className="text-amber-400">{optimization.result.scoringDifferential.beforeScore}%</span> ➔ Optimized: <span className="text-emerald-400">{optimization.result.scoringDifferential.afterScore}%</span> 
                <span className="text-emerald-400 font-bold ml-1.5">(+{optimization.result.scoringDifferential.improvement}%)</span>
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4 text-sky-400" /> Export CSV Feed
          </button>

          <button
            onClick={handleApprove}
            disabled={approved || loading}
            className={`px-6 py-2.5 rounded-xl font-extrabold text-xs shadow-lg flex items-center gap-2 transition-all ${
              approved
                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {approved ? 'Approved for Upload!' : `Approve ${activeChannel.toUpperCase()} Listing`}
          </button>
        </div>
      </div>

      {loading || !optimization ? (
        <div className="py-20 text-center glass-panel rounded-3xl border border-[var(--border-color)] my-6">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-[var(--text-muted)]">Generating channel-optimized copy for {activeChannel.toUpperCase()}...</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Claim Guard Inspection Card */}
          {optimization.result.claimGuard && (
            <ClaimGuardBadge claims={optimization.result.claimGuard.claims} />
          )}

          {/* Side-by-Side Comparison Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Original Listing Content */}
            <div className="p-6 rounded-3xl glass-panel border border-[var(--border-color)] space-y-4 bg-[var(--bg-primary)]/80">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> Original Listing (Score: {optimization.result.original.score}%)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-bold">Unoptimized</span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[var(--text-muted)] font-semibold block mb-1">Title</span>
                  <p className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] font-medium text-[var(--text-primary)]">
                    {optimization.result.original.title}
                  </p>
                </div>

                <div>
                  <span className="text-[var(--text-muted)] font-semibold block mb-1">Bullet Points</span>
                  <div className="space-y-2">
                    {optimization.result.original.bullets.map((b, i) => (
                      <p key={i} className="p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)]">
                        • {b}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: AI-Optimized Listing Content with "Why" Annotations */}
            <div className="p-6 rounded-3xl glass-panel border border-indigo-500/40 space-y-4 bg-indigo-950/20 shadow-xl shadow-indigo-500/5">
              <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" /> AI-Optimized for {activeChannel.toUpperCase()} (Score: {optimization.result.optimized.score}%)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                  SEO & Compliance Ready
                </span>
              </div>

              <div className="space-y-4 text-xs">
                
                {/* Optimized Title & Why Annotation */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[var(--text-muted)] font-semibold">Optimized Title</span>
                    <button
                      onClick={() => handleCopy(optimization.result.optimized.title, 'title')}
                      className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      {copiedField === 'title' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedField === 'title' ? 'Copied!' : 'Copy Title'}
                    </button>
                  </div>
                  <p className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-indigo-500/30 font-bold text-[var(--text-primary)]">
                    {optimization.result.optimized.title}
                  </p>
                  {optimization.result.optimized.titleReason && (
                    <div className="mt-1.5 p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                      <span><strong>Why this change was made:</strong> {optimization.result.optimized.titleReason}</span>
                    </div>
                  )}
                </div>

                {/* Optimized Bullets & Why Annotations */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[var(--text-muted)] font-semibold">Benefit-Driven 5 Bullet Points</span>
                    <button
                      onClick={() => handleCopy(optimization.result.optimized.bullets.join('\n'), 'bullets')}
                      className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      {copiedField === 'bullets' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedField === 'bullets' ? 'Copied All!' : 'Copy All Bullets'}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {optimization.result.optimized.bullets.map((b, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-1">
                        <div className="flex justify-between gap-2 text-[var(--text-primary)]">
                          <span>• {b}</span>
                          <button 
                            onClick={() => handleCopy(b, `bullet-${i}`)}
                            className="text-[var(--text-muted)] hover:text-indigo-400 shrink-0"
                            title="Copy bullet"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        {optimization.result.optimized.bulletReasons && optimization.result.optimized.bulletReasons[i] && (
                          <span className="text-[9px] text-indigo-300/80 block italic pl-3">
                            💡 <strong>Why:</strong> {optimization.result.optimized.bulletReasons[i]}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Backend Search Terms & Why Annotation */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[var(--text-muted)] font-semibold">249-Byte Backend Search Terms</span>
                    <button
                      onClick={() => handleCopy(optimization.result.optimized.backendSearchTerms, 'keywords')}
                      className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      {copiedField === 'keywords' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedField === 'keywords' ? 'Copied!' : 'Copy Keywords'}
                    </button>
                  </div>
                  <p className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] font-mono text-[11px]">
                    {optimization.result.optimized.backendSearchTerms}
                  </p>
                  {optimization.result.optimized.searchTermsReason && (
                    <div className="mt-1.5 p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                      <span><strong>Why:</strong> {optimization.result.optimized.searchTermsReason}</span>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
