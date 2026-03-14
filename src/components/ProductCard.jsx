import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

// Opciones de talla y color por categoría
const SIZES_BY_CATEGORY = {
  "men's clothing": ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  "women's clothing": ['XS', 'S', 'M', 'L', 'XL'],
  "jewelery": ['One Size'],
  "electronics": null,
};

const COLORS = [
  { name: 'Black',  hex: '#1a1a1a' },
  { name: 'White',  hex: '#f5f5f5' },
  { name: 'Navy',   hex: '#1e3a5f' },
  { name: 'Red',    hex: '#c0392b' },
  { name: 'Gray',   hex: '#7f8c8d' },
];

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const sizes = SIZES_BY_CATEGORY[product.category] ?? null;
  const showColors = ['men\'s clothing', 'women\'s clothing'].includes(product.category);

  const [selectedSize, setSelectedSize] = useState(sizes ? sizes[1] ?? sizes[0] : null);
  const [selectedColor, setSelectedColor] = useState(showColors ? COLORS[0] : null);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart({ ...product, selectedSize, selectedColor: selectedColor?.name });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const rating = product.rating?.rate ?? 0;
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="product-card rounded-3xl overflow-hidden flex flex-col h-full group transition-all duration-300 hover:shadow-2xl"
    >
      {/* Image */}
      <div className="relative aspect-square p-6 overflow-hidden product-img-bg">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
        />

        {/* Rating badge */}
        <div className="rating-badge absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
          <Star size={12} className="star-icon" fill="currentColor" />
          <span className="rating-text">{rating.toFixed(1)}</span>
        </div>

        {/* Color selector overlay */}
        {showColors && (
          <div className="absolute bottom-4 left-4 flex gap-2">
            {COLORS.map((c) => (
              <button
                key={c.name}
                title={c.name}
                onClick={() => setSelectedColor(c)}
                style={{ background: c.hex }}
                className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                  selectedColor?.name === c.name
                    ? 'border-primary-400 scale-125 shadow-lg'
                    : 'border-white/60 hover:scale-110'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-xs font-semibold text-primary-500 uppercase tracking-wider mb-1">
          {product.category}
        </span>
        <h3 className="font-bold text-base leading-tight mb-2 line-clamp-2 product-title group-hover:text-primary-500 transition-colors">
          {product.title}
        </h3>

        {/* Stars row */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => {
            const filled = i < fullStars;
            const half = !filled && i === fullStars && hasHalf;
            return (
              <Star
                key={i}
                size={14}
                fill={filled || half ? '#f59e0b' : 'none'}
                stroke="#f59e0b"
                strokeWidth={filled || half ? 0 : 1.5}
                className="shrink-0"
              />
            );
          })}
          <span className="text-xs text-slate-400 ml-1">({product.rating?.count ?? 0})</span>
        </div>

        {/* Size selector */}
        {sizes && sizes.length > 1 && (
          <div className="mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1 product-label">Size</p>
            <div className="flex flex-wrap gap-1.5">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`size-btn px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                    selectedSize === s ? 'size-btn-active' : 'size-btn-inactive'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price + Add */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-2xl font-black product-price">
            ${product.price}
          </span>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleAdd}
            className={`add-btn p-3 rounded-2xl transition-all duration-300 shadow-lg ${added ? 'add-btn-added' : ''}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="text-sm font-black"
                >
                  ✓
                </motion.span>
              ) : (
                <motion.span key="cart" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <ShoppingCart size={20} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
