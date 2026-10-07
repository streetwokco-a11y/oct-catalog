import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Globe, 
  Zap, 
  CheckCircle2, 
  RefreshCw, 
  ShoppingBag, 
  Layers, 
  Sparkles,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';

export default function MarketplaceDashboard({ onRefreshProducts }) {
  const [channels, setChannels] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  const fetchChannels = async () => {
    const data = await api.getChannels();
    setChannels(data);
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  // 1-Click Multi-Marketplace Sync Action
  const handlePublishAll = async () => {
    try {
      setSyncing(true);
      setSyncMessage('Dispatching listings to Amazon, Flipkart, Shopify, Myntra, & Nykaa...');
      const res = await api.publishToMarketplaces(null, null);
      setSyncMessage(`✓ Success: ${res.message}`);
      await fetchChannels();
      if (onRefreshProducts) await onRefreshProducts();
      setTimeout(() => setSyncMessage(''), 4000);
    } catch (err) {
      setSyncMessage(`❌ Error: ${err.message}`);
    } finally {
      setSyncing(false);
    }
  };

  const channelIcons = {
    amazon: '📦',
    flipkart: '🛍️',
    shopify: '🛒',
    myntra: '👗',
    nykaa: '💄'
  };

  return (
    <div className="mb-8 space-y-6 glass-panel rounded-3xl border border-[var(--border-color)] p-6 bg-gradient-to-r from-indigo-950/30 via-slate-900/40 to-slate-950">
      
      {/* Dashboard Top Header & 1-Click Sync CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Zap className="w-3.5 h-3.5" /> 1-Click Multi-Channel Sync Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            Marketplace Control Center
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Automated listing dispatch, stock rebalancing, and pricing rules across Amazon, Flipkart, Shopify, Myntra, and Nykaa.
          </p>
        </div>

        <button
          onClick={handlePublishAll}
          disabled={syncing}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 whitespace-nowrap"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing Marketplaces...' : '1-Click Sync All Marketplaces'}
        </button>
      </div>

      {syncMessage && (
        <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in ${
          syncMessage.startsWith('✓') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
        }`}>
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* 5 Channel Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {channels.map((ch) => (
          <div key={ch.channel} className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex flex-col justify-between hover:border-indigo-500/40 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{channelIcons[ch.channel] || '🌐'}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {ch.status}
                </span>
              </div>

              <h4 className="font-extrabold text-base text-[var(--text-primary)] tracking-tight">
                {ch.label}
              </h4>
              
              <p className="text-[11px] text-[var(--text-muted)] font-medium mt-0.5">
                Rule: {ch.pricingRule ? `+${ch.pricingRule.marginPercent}% Margin` : 'Base Price'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
              <div>
                <span className="text-lg font-extrabold text-[var(--text-primary)]">{ch.liveCount}</span>
                <span className="text-[10px] text-[var(--text-muted)] block">Live Sync</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-sky-400">100%</span>
                <span className="text-[10px] text-[var(--text-muted)] block">Health</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
