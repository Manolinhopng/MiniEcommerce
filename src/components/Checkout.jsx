import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, MapPin, CheckCircle2, ShieldCheck, Lock, AlertCircle, CheckCircle } from 'lucide-react';

/* ============================================================
   CARD UTILITIES
   ============================================================ */

/**
 * Detect card network from the raw number string.
 * Returns { name, color, textColor, logo } or null.
 */
const detectCardNetwork = (raw) => {
  const n = raw.replace(/\s/g, '');
  if (!n) return null;

  // Visa — starts with 4, 13 or 16 digits
  if (/^4/.test(n)) {
    return {
      name: 'Visa',
      color: '#1a1f71',
      gradient: 'linear-gradient(135deg, #1a1f71 0%, #0056b3 100%)',
      logo: <VisaLogo />,
    };
  }
  // Mastercard — starts with 51-55 or 2221-2720
  if (/^5[1-5]/.test(n) || /^2(2[2-9][1-9]|[3-6]\d{2}|7[01]\d|720)/.test(n)) {
    return {
      name: 'Mastercard',
      color: '#eb001b',
      gradient: 'linear-gradient(135deg, #1d1d1d 0%, #333 100%)',
      logo: <MastercardLogo />,
    };
  }
  // American Express — starts with 34 or 37, 15 digits
  if (/^3[47]/.test(n)) {
    return {
      name: 'Amex',
      color: '#007bc1',
      gradient: 'linear-gradient(135deg, #007bc1 0%, #005a8e 100%)',
      logo: <AmexLogo />,
    };
  }
  // Discover — starts with 6011, 622126-622925, 644-649, 65
  if (/^6(011|22[1-9]|4[4-9]|5)/.test(n)) {
    return {
      name: 'Discover',
      color: '#ff6600',
      gradient: 'linear-gradient(135deg, #ff6600 0%, #cc4400 100%)',
      logo: <DiscoverLogo />,
    };
  }

  return { name: 'Unknown', color: '#64748b', gradient: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)', logo: null };
};

/**
 * Luhn algorithm — validates a card number is structurally valid.
 */
const luhnCheck = (raw) => {
  const digits = raw.replace(/\s/g, '');
  if (!/^\d+$/.test(digits) || digits.length < 13) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10);
    if (shouldDouble) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

/** Expected length for each network */
const expectedLength = (network) => {
  if (!network) return 16;
  if (network.name === 'Amex') return 15;
  return 16;
};

/* ============================================================
   SVG LOGOS (inline, no external deps)
   ============================================================ */
const VisaLogo = () => (
  <svg viewBox="0 0 48 16" width="48" height="16" fill="none">
    <text x="0" y="13" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="15" fill="white" letterSpacing="1">VISA</text>
  </svg>
);

const MastercardLogo = () => (
  <svg viewBox="0 0 46 28" width="46" height="28">
    <circle cx="16" cy="14" r="14" fill="#eb001b" />
    <circle cx="30" cy="14" r="14" fill="#f79e1b" />
    <path d="M23 5.7a14 14 0 0 1 0 16.6A14 14 0 0 1 23 5.7z" fill="#ff5f00" />
  </svg>
);

const AmexLogo = () => (
  <svg viewBox="0 0 55 14" width="55" height="14" fill="none">
    <text x="0" y="12" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="12" fill="white" letterSpacing="0.5">AMEX</text>
  </svg>
);

const DiscoverLogo = () => (
  <svg viewBox="0 0 70 14" width="70" height="14" fill="none">
    <text x="0" y="12" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="11" fill="white">DISCOVER</text>
  </svg>
);

/* ============================================================
   CARD VISUAL COMPONENT
   ============================================================ */
const CardPreview = ({ number, name, expiry, network, isValid }) => {
  const displayNumber = number || '•••• •••• •••• ••••';
  const displayName = name || 'CARDHOLDER NAME';
  const displayExpiry = expiry || 'MM/YY';
  const gradient = network?.gradient || 'linear-gradient(135deg, #1e3a5f 0%, #0ea5e9 60%, #6366f1 100%)';

  return (
    <div
      className="relative rounded-2xl p-5 overflow-hidden mb-2 transition-all duration-500"
      style={{ background: gradient, minHeight: 130 }}
    >
      {/* Shine overlay */}
      <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)' }} />

      {/* Card chip */}
      <div className="absolute top-5 left-5 w-8 h-6 rounded-md bg-yellow-300/70 flex items-end justify-end p-0.5">
        <div className="w-full h-2/3 grid grid-cols-2 gap-px opacity-60">
          {[...Array(6)].map((_, i) => <div key={i} className="bg-yellow-600/80 rounded-sm" />)}
        </div>
      </div>

      {/* Network logo */}
      <div className="absolute top-4 right-4">
        {network?.logo}
      </div>

      {/* Network name badge */}
      {network && network.name !== 'Unknown' && (
        <div className="absolute top-4 right-4 pr-0">
          {/* logo shown above */}
        </div>
      )}

      {/* Number */}
      <p className="text-white font-mono text-base tracking-widest mt-8 mb-4 drop-shadow">
        {displayNumber}
      </p>

      {/* Bottom row */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-white/50 text-[9px] uppercase tracking-widest mb-0.5">Card Holder</p>
          <p className="text-white text-xs font-bold tracking-wider truncate max-w-[180px]">{displayName}</p>
        </div>
        <div className="text-right">
          <p className="text-white/50 text-[9px] uppercase tracking-widest mb-0.5">Expires</p>
          <p className="text-white text-xs font-bold">{displayExpiry}</p>
        </div>
      </div>

      {/* Valid indicator */}
      <AnimatePresence>
        {isValid && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute bottom-4 right-4 bg-green-500 rounded-full p-0.5"
          >
            <CheckCircle size={14} className="text-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ============================================================
   CARD NUMBER INPUT WITH VALIDATION
   ============================================================ */
const CardNumberInput = ({ value, onChange }) => {
  const raw = value.replace(/\s/g, '');
  const network = detectCardNetwork(raw);
  const maxLen = expectedLength(network);
  const digitsEntered = raw.length;
  const isComplete = digitsEntered === maxLen;
  const isValid = isComplete && luhnCheck(raw);
  const isInvalid = isComplete && !luhnCheck(raw);

  // Format: Amex = 4-6-5, others = 4-4-4-4
  const formatNumber = (val) => {
    const digits = val.replace(/\D/g, '');
    if (network?.name === 'Amex') {
      const p1 = digits.slice(0, 4);
      const p2 = digits.slice(4, 10);
      const p3 = digits.slice(10, 15);
      return [p1, p2, p3].filter(Boolean).join(' ');
    }
    return digits.slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  };

  const handleChange = (e) => {
    const formatted = formatNumber(e.target.value);
    onChange(formatted, network, isValid);
  };

  const borderClass = isValid
    ? 'border-green-500 ring-2 ring-green-400/30'
    : isInvalid
    ? 'border-red-500 ring-2 ring-red-400/30'
    : '';

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="checkout-label text-xs font-semibold uppercase tracking-wider">Card Number</label>
        <AnimatePresence mode="wait">
          {network && network.name !== 'Unknown' && (
            <motion.span
              key={network.name}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="card-network-badge text-xs font-black px-2 py-0.5 rounded-lg"
              style={{ background: network.color, color: '#fff' }}
            >
              {network.name}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="relative">
        <input
          required
          type="text"
          inputMode="numeric"
          placeholder={network?.name === 'Amex' ? '3782 822463 10005' : '4242 4242 4242 4242'}
          value={value}
          onChange={handleChange}
          maxLength={network?.name === 'Amex' ? 17 : 19}
          className={`checkout-input w-full px-4 py-3 pr-10 rounded-xl text-sm font-mono outline-none transition-all ${borderClass}`}
        />
        <AnimatePresence mode="wait">
          {isValid && (
            <motion.div key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute right-3 top-1/2 -translate-y-1/2">
              <CheckCircle size={18} className="text-green-500" />
            </motion.div>
          )}
          {isInvalid && (
            <motion.div key="err" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute right-3 top-1/2 -translate-y-1/2">
              <AlertCircle size={18} className="text-red-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Validation message */}
      <AnimatePresence>
        {isInvalid && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-red-500 text-xs font-semibold mt-1 flex items-center gap-1"
          >
            <AlertCircle size={11} /> Invalid card number. Please check and try again.
          </motion.p>
        )}
        {isValid && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-green-500 text-xs font-semibold mt-1 flex items-center gap-1"
          >
            <CheckCircle size={11} /> Valid {network?.name} card ✓
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
const STEPS = ['Shipping', 'Payment', 'Confirmation'];
const fakeDelay = (fn, ms = 2000) => setTimeout(fn, ms);

const CheckoutModal = ({ isOpen, onClose, total, onClearCart }) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // form state
  const [info, setInfo] = useState({ name: '', email: '', address: '', city: '', zip: '' });
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [cardNetwork, setCardNetwork] = useState(null);
  const [cardValid, setCardValid] = useState(false);

  const handleShippingNext = (e) => {
    e.preventDefault();
    setStep(1);
  };

  const handlePaymentNext = (e) => {
    e.preventDefault();
    if (!cardValid) return; // extra guard — button is disabled anyway
    setLoading(true);
    fakeDelay(() => {
      setLoading(false);
      setStep(2);
    });
  };

  const handleDone = () => {
    onClearCart?.();
    setStep(0);
    setCard({ number: '', name: '', expiry: '', cvv: '' });
    setCardNetwork(null);
    setCardValid(false);
    onClose();
  };

  const handleClose = () => {
    setStep(0);
    onClose();
  };

  const handleCardNumberChange = (formatted, network, valid) => {
    setCard(p => ({ ...p, number: formatted }));
    setCardNetwork(network);
    setCardValid(valid);
  };

  const formatExpiry = (val) => {
    const d = val.replace(/\D/g, '').slice(0, 4);
    return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  // Confirmation order ID (stable per render)
  const orderId = useMemo(() => `DEMO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, [step === 2]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 22, stiffness: 220 }}
            className="checkout-modal fixed inset-0 m-auto w-full max-w-lg h-fit max-h-[90vh] rounded-3xl overflow-y-auto z-[70] shadow-2xl"
          >
            {/* Demo Banner */}
            <div className="demo-banner flex items-center justify-center gap-2 py-2 text-xs font-black uppercase tracking-widest">
              <ShieldCheck size={14} />
              <span>⚠ Demo Checkout — No real payment processed ⚠</span>
            </div>

            {/* Header */}
            <div className="checkout-header p-6 flex items-center justify-between border-b checkout-border">
              <div>
                <h2 className="text-xl font-black checkout-heading">Checkout</h2>
                <p className="text-xs checkout-sub mt-0.5">Total: <strong className="text-primary-500">${total?.toFixed(2)}</strong></p>
              </div>
              <button onClick={handleClose} className="p-2 rounded-full checkout-close-btn transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Steps indicator */}
            <div className="flex items-center justify-center gap-2 px-6 py-4 checkout-steps-bg">
              {STEPS.map((s, i) => (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300 ${
                      i < step ? 'step-done' : i === step ? 'step-active' : 'step-inactive'
                    }`}>
                      {i < step ? '✓' : i + 1}
                    </div>
                    <span className={`text-xs font-semibold ${i === step ? 'step-label-active' : 'step-label'}`}>{s}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`h-0.5 flex-1 mb-4 rounded transition-all duration-500 ${i < step ? 'step-line-done' : 'step-line'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">

                {/* ── Step 0: Shipping ── */}
                {step === 0 && (
                  <motion.form
                    key="shipping"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    onSubmit={handleShippingNext}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={18} className="text-primary-500" />
                      <h3 className="font-bold checkout-heading">Shipping Information</h3>
                    </div>

                    {[
                      { label: 'Full Name', key: 'name', placeholder: 'John Doe', type: 'text' },
                      { label: 'Email', key: 'email', placeholder: 'john@example.com', type: 'email' },
                      { label: 'Address', key: 'address', placeholder: '123 Main St', type: 'text' },
                    ].map(({ label, key, placeholder, type }) => (
                      <div key={key}>
                        <label className="checkout-label text-xs font-semibold uppercase tracking-wider block mb-1">{label}</label>
                        <input
                          required
                          type={type}
                          placeholder={placeholder}
                          value={info[key]}
                          onChange={e => setInfo(p => ({ ...p, [key]: e.target.value }))}
                          className="checkout-input w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all"
                        />
                      </div>
                    ))}

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'City', key: 'city', placeholder: 'New York' },
                        { label: 'ZIP Code', key: 'zip', placeholder: '10001' },
                      ].map(({ label, key, placeholder }) => (
                        <div key={key}>
                          <label className="checkout-label text-xs font-semibold uppercase tracking-wider block mb-1">{label}</label>
                          <input
                            required
                            type="text"
                            placeholder={placeholder}
                            value={info[key]}
                            onChange={e => setInfo(p => ({ ...p, [key]: e.target.value }))}
                            className="checkout-input w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all"
                          />
                        </div>
                      ))}
                    </div>

                    <button type="submit" className="checkout-btn-primary w-full py-3.5 rounded-2xl font-black uppercase tracking-widest mt-2 transition-all active:scale-95">
                      Continue to Payment →
                    </button>
                  </motion.form>
                )}

                {/* ── Step 1: Payment ── */}
                {step === 1 && (
                  <motion.form
                    key="payment"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    onSubmit={handlePaymentNext}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard size={18} className="text-primary-500" />
                      <h3 className="font-bold checkout-heading">Payment Details</h3>
                    </div>

                    {/* Live card preview */}
                    <CardPreview
                      number={card.number}
                      name={card.name}
                      expiry={card.expiry}
                      network={cardNetwork}
                      isValid={cardValid}
                    />

                    {/* Validated card number input */}
                    <CardNumberInput value={card.number} onChange={handleCardNumberChange} />

                    <div>
                      <label className="checkout-label text-xs font-semibold uppercase tracking-wider block mb-1">Name on Card</label>
                      <input
                        required
                        type="text"
                        placeholder="John Doe"
                        value={card.name}
                        onChange={e => setCard(p => ({ ...p, name: e.target.value.toUpperCase() }))}
                        className="checkout-input w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="checkout-label text-xs font-semibold uppercase tracking-wider block mb-1">Expiry</label>
                        <input
                          required
                          type="text"
                          placeholder="MM/YY"
                          value={card.expiry}
                          onChange={e => setCard(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                          maxLength={5}
                          className="checkout-input w-full px-4 py-3 rounded-xl text-sm font-mono outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="checkout-label text-xs font-semibold uppercase tracking-wider block mb-1">
                          CVV {cardNetwork?.name === 'Amex' ? '(4 digits)' : '(3 digits)'}
                        </label>
                        <input
                          required
                          type="password"
                          placeholder={cardNetwork?.name === 'Amex' ? '••••' : '•••'}
                          value={card.cvv}
                          onChange={e => setCard(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, cardNetwork?.name === 'Amex' ? 4 : 3) }))}
                          maxLength={cardNetwork?.name === 'Amex' ? 4 : 3}
                          className="checkout-input w-full px-4 py-3 rounded-xl text-sm font-mono outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Accepted networks */}
                    <div className="flex items-center gap-3 py-2">
                      <span className="text-xs checkout-sub font-semibold">Accepted:</span>
                      {[
                        { name: 'Visa', color: '#1a1f71' },
                        { name: 'MC', color: '#1d1d1d' },
                        { name: 'Amex', color: '#007bc1' },
                        { name: 'Disc', color: '#ff6600' },
                      ].map((n) => (
                        <span
                          key={n.name}
                          className={`text-[10px] font-black px-2 py-0.5 rounded transition-all duration-300 ${
                            cardNetwork?.name?.startsWith(n.name.slice(0,4)) || (n.name === 'MC' && cardNetwork?.name === 'Mastercard')
                              ? 'opacity-100 scale-110'
                              : 'opacity-30'
                          }`}
                          style={{ background: n.color, color: '#fff' }}
                        >
                          {n.name}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-xs checkout-sub">
                      <Lock size={12} />
                      <span>This is a demo — no real data is stored or charged.</span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !cardValid}
                      title={!cardValid ? 'Please enter a valid card number' : ''}
                      className="checkout-btn-primary w-full py-3.5 rounded-2xl font-black uppercase tracking-widest mt-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : !cardValid ? (
                        'Enter a valid card to pay'
                      ) : (
                        `Pay $${total?.toFixed(2)}`
                      )}
                    </button>

                    <button type="button" onClick={() => setStep(0)} className="w-full text-center text-xs checkout-sub hover:text-primary-500 transition-colors mt-1">
                      ← Back to Shipping
                    </button>
                  </motion.form>
                )}

                {/* ── Step 2: Confirmation ── */}
                {step === 2 && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6 space-y-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
                    >
                      <CheckCircle2 size={72} className="text-green-500 mx-auto" />
                    </motion.div>
                    <h3 className="text-2xl font-black checkout-heading">Order Confirmed!</h3>
                    <p className="checkout-sub text-sm max-w-xs mx-auto">
                      Your demo order has been placed. In a real store, you'd receive a confirmation at <strong>{info.email || 'your email'}</strong>.
                    </p>
                    <div className="demo-banner rounded-2xl px-4 py-3 text-xs font-bold mx-auto inline-block">
                      🎉 This was a simulated checkout — nothing was charged!
                    </div>
                    <div className="checkout-summary rounded-2xl p-4 text-left space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="checkout-sub">Order ID</span>
                        <span className="font-mono font-bold">#{orderId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="checkout-sub">Total Paid</span>
                        <span className="font-black text-primary-500">${total?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="checkout-sub">Ship to</span>
                        <span className="font-bold">{info.city || 'N/A'}</span>
                      </div>
                      {cardNetwork && cardNetwork.name !== 'Unknown' && (
                        <div className="flex justify-between items-center">
                          <span className="checkout-sub">Paid with</span>
                          <span
                            className="text-xs font-black px-2.5 py-0.5 rounded-lg text-white"
                            style={{ background: cardNetwork.color }}
                          >
                            {cardNetwork.name} ···· {card.number.replace(/\s/g, '').slice(-4)}
                          </span>
                        </div>
                      )}
                    </div>
                    <button onClick={handleDone} className="checkout-btn-primary w-full py-3.5 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 mt-2">
                      Done — Back to Shop
                    </button>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;
