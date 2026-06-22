import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppProvider';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  onClick,
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  ...props
}) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    glass: 'btn-glass',
    danger: 'inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold uppercase tracking-wider text-sm rounded-lg transition-all duration-300 hover:bg-red-700',
    ghost: 'inline-flex items-center justify-center gap-2 px-4 py-2 text-titan-secondary hover:text-titan-red transition-colors',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: '',
    lg: 'px-8 py-4 text-base',
  };

  const classes = `${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''} ${className}`;

  const content = (
    <>
      {loading && <i className="fa-solid fa-spinner fa-spin" />}
      {children}
    </>
  );

  if (to) return <Link to={to} className={classes} {...props}>{content}</Link>;
  if (href) return <a href={href} className={classes} {...props}>{content}</a>;

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled || loading} {...props}>
      {content}
    </button>
  );
}

export function IconButton({ icon, badge, to, onClick, label, className = '' }) {
  const content = (
    <span className={`relative inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 hover:border-titan-red/50 hover:text-titan-red transition-all duration-300 ${className}`}>
      <i className={`fa-solid ${icon}`} />
      {badge > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-titan-red text-white text-[10px] font-bold rounded-full px-1">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </span>
  );

  if (to) return <Link to={to} aria-label={label}>{content}</Link>;
  return <button onClick={onClick} aria-label={label}>{content}</button>;
}

export function WishlistButton({ item, type }) {
  const { addToWishlist, removeFromWishlist, isInWishlist, wishlist } = useApp();
  const inList = isInWishlist(item.id, type);
  const wishlistItem = wishlist.find((w) => w.id === item.id && w.type === type);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inList && wishlistItem) {
      removeFromWishlist(wishlistItem.wishlistId);
    } else {
      addToWishlist({
        id: item.id,
        name: item.name,
        type,
        price: item.price || item.sessionPrice || item.pricing?.monthly || 0,
        image: item.image,
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
        inList ? 'bg-titan-red border-titan-red text-white' : 'border-white/20 hover:border-titan-red hover:text-titan-red'
      }`}
      aria-label={inList ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <i className={`fa-${inList ? 'solid' : 'regular'} fa-heart`} />
    </button>
  );
}
