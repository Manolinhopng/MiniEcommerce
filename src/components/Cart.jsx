import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CheckoutModal from './Checkout';

const Cart = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="cart-panel fixed right-0 top-0 h-full w-full max-w-md shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="p-6 cart-border border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="text-primary-500" />
                  <h2 className="text-xl font-black uppercase tracking-tight cart-heading">Your Cart</h2>
                  <span className="bg-primary-500/20 text-primary-500 px-2 py-0.5 rounded-full text-xs font-bold">
                    {cart.length} items
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 cart-close-btn rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Items */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                    <div className="cart-empty-icon-bg p-8 rounded-full">
                      <ShoppingBag size={48} />
                    </div>
                    <div>
                      <p className="font-bold text-lg cart-heading">Your cart is empty</p>
                      <p className="text-sm cart-sub">Start adding some amazing products!</p>
                    </div>
                  </div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      layout
                      key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                      className="flex gap-4 group"
                    >
                      <div className="w-20 h-20 cart-img-bg rounded-2xl overflow-hidden p-2 shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-sm leading-tight line-clamp-1 mb-0.5 cart-heading">
                          {item.title}
                        </h4>
                        {/* Variant info */}
                        {(item.selectedSize || item.selectedColor) && (
                          <p className="text-xs cart-sub mb-1">
                            {item.selectedSize && <span className="cart-tag">Size: {item.selectedSize}</span>}
                            {item.selectedColor && <span className="cart-tag ml-1">Color: {item.selectedColor}</span>}
                          </p>
                        )}
                        <p className="text-primary-500 font-black text-base mb-3">${item.price}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 cart-qty-bg px-3 py-1.5 rounded-xl">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-0.5 hover:text-primary-500 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-bold w-4 text-center cart-heading">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-0.5 hover:text-primary-500 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="p-6 cart-footer border-t cart-border space-y-4">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="cart-sub">Subtotal</span>
                    <span className="cart-heading font-bold">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="cart-sub">Shipping</span>
                    <span className="text-green-500 font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between items-center text-xl font-black">
                    <span className="cart-heading">Total</span>
                    <span className="text-primary-500 font-black">${total.toFixed(2)}</span>
                  </div>
                  <button
                    className="checkout-trigger-btn w-full py-4 rounded-2xl font-black uppercase tracking-wider transition-all shadow-xl active:scale-95"
                    onClick={() => setCheckoutOpen(true)}
                  >
                    Checkout →
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full text-center text-xs font-bold cart-sub hover:text-red-500 transition-colors uppercase tracking-widest"
                  >
                    Clear Cart
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        total={total}
        onClearCart={clearCart}
      />
    </>
  );
};

export default Cart;
