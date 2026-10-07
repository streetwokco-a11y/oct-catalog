import React, { useState } from 'react';
import { Lock, ShieldAlert, KeyRound, Sparkles, LogIn, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function AuthModal({ onLoginSuccess }) {
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError('Please enter your authorization passcode.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const data = await api.login(passcode);
      if (data.success && data.token) {
        localStorage.setItem('oct_auth_token', data.token);
        localStorage.setItem('oct_user', JSON.stringify(data.user));
        onLoginSuccess(data);
      } else {
        setError(data.message || 'Access Denied: Invalid Passcode.');
      }
    } catch (err) {
      setError('Authentication failed. Please check passcode.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md glass-panel rounded-3xl border border-indigo-500/30 p-8 shadow-2xl shadow-indigo-500/10 relative overflow-hidden">
        
        {/* Top Decorative Glow */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8 relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 mx-auto mb-4 shadow-xl shadow-indigo-600/30 flex items-center justify-center">
            <div className="w-full h-full bg-[var(--bg-primary)] rounded-[14px] flex items-center justify-center">
              <Lock className="w-8 h-8 text-indigo-400" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Authorized Access Only
          </div>

          <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">
            OCT Enterprise Gateway
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Multi-Channel E-Commerce Intelligence & Audit Platform
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
              Authorization Passcode
            </label>
            <div className="relative">
              <KeyRound className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="password"
                placeholder="Enter access passcode..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                autoFocus
                className="w-full pl-11 pr-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Verify & Enter Platform</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[var(--border-color)] text-center text-[11px] text-[var(--text-muted)] flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>256-Bit Edge Encrypted Authentication</span>
        </div>

      </div>
    </div>
  );
}
