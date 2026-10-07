import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Dna, 
  Sparkles, 
  Users, 
  Award, 
  Palette, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';

export default function BrandDnaProfileView() {
  const [dna, setDna] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const loadDna = async () => {
      setLoading(true);
      const data = await api.getBrandDna();
      setDna(data);
      setLoading(false);
    };
    loadDna();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.saveBrandDna(dna);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Error saving Brand DNA: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center glass-panel rounded-3xl border border-[var(--border-color)] my-6">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-[var(--text-muted)]">Loading Brand & Listing DNA Profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl border border-[var(--border-color)] p-6 sm:p-8 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-950">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Dna className="w-3.5 h-3.5" /> Brand Strategy Foundation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
              Brand & Listing DNA Profile
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">
              Establishes brand voice, target buyer personas, USPs, and visual guidelines used as system context by AI Subagents.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 whitespace-nowrap"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving Profile...' : 'Save Brand DNA Profile'}
          </button>
        </div>

        {saveSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Brand & Listing DNA successfully updated and synced across AI Agents!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Section 1: Brand Voice & Tone */}
        <div className="p-6 rounded-3xl glass-panel border border-[var(--border-color)] space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="font-extrabold text-lg text-[var(--text-primary)]">1. Brand Voice & Tone</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[var(--text-muted)] font-semibold mb-1">Brand Name & Sector</label>
              <input
                type="text"
                value={dna.brandName}
                onChange={(e) => setDna({ ...dna, brandName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[var(--text-muted)] font-semibold mb-1">Voice Personality & Tone</label>
              <input
                type="text"
                value={dna.voiceAndTone.personality}
                onChange={(e) => setDna({ ...dna, voiceAndTone: { ...dna.voiceAndTone, personality: e.target.value } })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-emerald-400 font-semibold mb-1">Vocabulary (DO's)</label>
                <textarea
                  rows="2"
                  value={dna.voiceAndTone.vocabularyDo.join(', ')}
                  onChange={(e) => setDna({ ...dna, voiceAndTone: { ...dna.voiceAndTone, vocabularyDo: e.target.value.split(', ') } })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-rose-400 font-semibold mb-1">Vocabulary (DONT's)</label>
                <textarea
                  rows="2"
                  value={dna.voiceAndTone.vocabularyDont.join(', ')}
                  onChange={(e) => setDna({ ...dna, voiceAndTone: { ...dna.voiceAndTone, vocabularyDont: e.target.value.split(', ') } })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[var(--border-color)]">
              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">On-Brand Example</span>
                <p className="text-xs text-[var(--text-primary)] italic mt-1">"{dna.voiceAndTone.onBrandExample}"</p>
              </div>
              <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">Off-Brand Example</span>
                <p className="text-xs text-[var(--text-primary)] italic mt-1">"{dna.voiceAndTone.offBrandExample}"</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Target Buyer Personas */}
        <div className="p-6 rounded-3xl glass-panel border border-[var(--border-color)] space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
            <Users className="w-5 h-5 text-sky-400" />
            <h3 className="font-extrabold text-lg text-[var(--text-primary)]">2. Target Buyer Personas</h3>
          </div>

          {dna.buyerPersonas.map((persona, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-indigo-400 text-sm">{persona.role}</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-bold">{persona.ageGroup}</span>
              </div>
              <p className="text-[var(--text-secondary)]"><strong className="text-[var(--text-primary)]">Key Traits:</strong> {persona.keyTraits}</p>
              <p className="text-[var(--text-secondary)]"><strong className="text-[var(--text-primary)]">Pain Points:</strong> {persona.painPoints}</p>
            </div>
          ))}
        </div>

        {/* Section 3: USPs & Differentiators */}
        <div className="p-6 rounded-3xl glass-panel border border-[var(--border-color)] space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-lg text-[var(--text-primary)]">3. Unique Selling Propositions</h3>
          </div>

          <div className="space-y-2 text-xs">
            {dna.usps.map((usp, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center gap-2.5 font-semibold text-[var(--text-primary)]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{usp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Visual Style Guidelines */}
        <div className="p-6 rounded-3xl glass-panel border border-[var(--border-color)] space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
            <Palette className="w-5 h-5 text-purple-400" />
            <h3 className="font-extrabold text-lg text-[var(--text-primary)]">4. Visual Style Guidelines</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <span className="text-[var(--text-muted)] font-semibold block text-[10px] uppercase">Main Photo Rule</span>
              <p className="font-bold text-[var(--text-primary)] mt-1">{dna.visualStyle.mainPhotoStyle}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <span className="text-[var(--text-muted)] font-semibold block text-[10px] uppercase">Secondary Photo Shot List</span>
              <p className="font-semibold text-[var(--text-primary)] mt-1">{dna.visualStyle.secondaryPhotos}</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
