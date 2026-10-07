import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, ShoppingBag, Truck, CheckCircle2 } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQty, onRemoveItem, onClearCart, onSubmitOrder }) {
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * discount) / 100;
  const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 49;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const freeShippingThreshold = 1500;
  const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'OCT2026') {
      setDiscount(15);
      setPromoApplied(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid Promo Code. Use "OCT2026" for 15% OFF');
    }
  };

  const handleCheckout = async () => {
    try {
      setSubmitting(true);
      setErrorMsg('');
      if (onSubmitOrder) {
        await onSubmitOrder(promoApplied ? 'OCT2026' : null);
      } else {
        onClearCart();
      }
      setIsCheckedOut(true);
      setTimeout(() => {
        setIsCheckedOut(false);
        onClose();
      }, 2500);
    } catch (err) {
      setErrorMsg(err.message || 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fade-in flex justify-end">
      <div className="w-full max-w-md bg-[var(--bg-primary)] h-full border-l border-[var(--border-color)] p-6 flex flex-col justify-between shadow-2xl relative">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-400" />
            <h3 className="font-extrabold text-lg text-[var(--text-primary)]">Production Order Cart</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-bold">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)} items
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="py-3 px-4 my-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
              <Truck className="w-3.5 h-3.5 text-indigo-400" />
              {subtotal >= freeShippingThreshold 
                ? 'Unlocked Free Express Delivery!' 
                : `Add $${(freeShippingThreshold - subtotal).toLocaleString()} more for Free Delivery`}
            </span>
          </div>
          <div className="w-full h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300" 
              style={{ width: `${shippingProgress}%` }}
            />
          </div>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Checkout Confirmation View */}
        {isCheckedOut ? (
          <div className="my-auto py-12 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-2xl font-extrabold text-[var(--text-primary)]">Order Confirmed!</h4>
            <p className="text-sm text-[var(--text-secondary)]">
              Your transaction has been processed and stored in the database. Stock inventory updated.
            </p>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto my-2 space-y-4 pr-1">
              {cartItems.length === 0 ? (
                <div className="py-20 text-center text-[var(--text-muted)] space-y-2">
                  <ShoppingBag className="w-12 h-12 mx-auto opacity-40" />
                  <p className="text-sm font-medium">Your cart is currently empty</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex gap-3 items-center">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 rounded-lg object-cover bg-[var(--bg-tertiary)]"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[var(--text-primary)] truncate">{item.name}</h4>
                      <p className="text-xs text-[var(--text-muted)] font-semibold mt-0.5">
                        ${item.price.toLocaleString()}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <button 
                          onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded bg-[var(--bg-tertiary)] text-xs font-bold hover:bg-[var(--accent-primary)] hover:text-white"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold px-2">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-[var(--bg-tertiary)] text-xs font-bold hover:bg-[var(--accent-primary)] hover:text-white"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-2 text-[var(--text-muted)] hover:text-rose-400 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Promo Code & Order Summary Footer */}
            {cartItems.length > 0 && (
              <div className="pt-4 border-t border-[var(--border-color)] space-y-3">
                
                {/* Promo Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo Code (OCT2026)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-3 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--accent-primary)] hover:text-white text-xs font-bold rounded-xl transition-all"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-[10px] text-emerald-400 font-bold">✓ 15% Promotional Discount Applied!</p>
                )}

                {/* Costs Breakdown */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-[var(--text-muted)]">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Discount (15%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[var(--text-muted)]">
                    <span>Express Delivery</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-[var(--text-primary)] pt-2 border-t border-[var(--border-color)]">
                    <span>Total Amount</span>
                    <span className="gradient-text">${total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Processing Transaction...' : 'Process Order & Update DB'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
