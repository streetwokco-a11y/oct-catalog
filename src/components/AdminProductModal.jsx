import React, { useState } from 'react';
import { X, Plus, Save, PackagePlus, AlertCircle } from 'lucide-react';

export default function AdminProductModal({ isOpen, onClose, onSaveProduct, editingProduct }) {
  const [formData, setFormData] = useState(
    editingProduct || {
      name: '',
      category: 'ai-hardware',
      price: '',
      originalPrice: '',
      stock: '',
      badge: 'New Product',
      description: '',
      image: '',
      specsKey1: 'Processor',
      specsVal1: '',
      specsKey2: 'Memory',
      specsVal2: ''
    }
  );

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.price || !formData.stock) {
      setError('Please fill in required fields: Product Name, Price, and Stock.');
      return;
    }

    try {
      setSubmitting(true);
      const specs = {};
      if (formData.specsKey1 && formData.specsVal1) specs[formData.specsKey1] = formData.specsVal1;
      if (formData.specsKey2 && formData.specsVal2) specs[formData.specsKey2] = formData.specsVal2;

      const payload = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        stock: Number(formData.stock),
        badge: formData.badge,
        description: formData.description,
        image: formData.image || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80',
        specs
      };

      await onSaveProduct(payload);
      onClose();
    } catch (err) {
      setError(err.message || 'Error saving product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto glass-panel rounded-3xl border border-[var(--border-color)] p-6 bg-[var(--bg-primary)] shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-2">
            <PackagePlus className="w-5 h-5 text-indigo-400" />
            <h3 className="font-extrabold text-lg text-[var(--text-primary)]">
              {editingProduct ? 'Edit Catalog Product' : 'Add New Production Item'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block text-[var(--text-muted)] font-semibold mb-1">Product Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Neural Processor Core v2"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[var(--text-muted)] font-semibold mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-indigo-500"
              >
                <option value="ai-hardware">AI Hardware & Robotics</option>
                <option value="electronics">Next-Gen Electronics</option>
                <option value="apparel">Cyber Apparel & Wearables</option>
                <option value="smart-home">Smart Home Automation</option>
              </select>
            </div>
            <div>
              <label className="block text-[var(--text-muted)] font-semibold mb-1">Badge Tag</label>
              <input
                type="text"
                placeholder="e.g. Flagship / Popular"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[var(--text-muted)] font-semibold mb-1">Price ($) *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                placeholder="999.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[var(--text-muted)] font-semibold mb-1">Original Price ($)</label>
              <input
                type="number"
                min="0"
                placeholder="1199.00"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[var(--text-muted)] font-semibold mb-1">Stock Units *</label>
              <input
                type="number"
                required
                min="0"
                placeholder="50"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[var(--text-muted)] font-semibold mb-1">Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[var(--text-muted)] font-semibold mb-1">Description</label>
            <textarea
              rows="3"
              placeholder="Enter detailed technical description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-[var(--border-color)] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              <Save className="w-4 h-4" />
              {submitting ? 'Saving...' : 'Save Product'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
